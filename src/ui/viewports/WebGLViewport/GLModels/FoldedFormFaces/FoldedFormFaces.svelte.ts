import earcut from "earcut";
import type { WebGLViewport } from "../../WebGLViewport.svelte.ts";
import type { ElementArray, GLModel, VertexArray } from "../../GLModel.ts";
import { prepareForRendering } from "../rendering.ts";
import { createProgram } from "rabbit-ear/webgl/general/webgl.js";
import { makeUniforms } from "./uniforms.ts";
import {
  makeFoldedVertexArrays,
  makeFoldedElementArrays,
} from "./arrays.js";
import model_100_vert from "./shaders/model-100.vert?raw";
import model_100_frag from "./shaders/model-100.frag?raw";
import model_300_vert from "./shaders/model-300.vert?raw";
import model_300_frag from "./shaders/model-300.frag?raw";
import type { FOLD } from "rabbit-ear/types.js";
import { untrack } from "svelte";
import { makeVerticesNormal } from "rabbit-ear/graph/normals.js";

export class FoldedFormFaces implements GLModel {
  viewport: WebGLViewport;

  showTriangulation?: boolean = $state(false);

  // the source graph on the embedding will be processed before being set to here.
  // these two graphs are not isomorphic (source and this one for rendering).
  // (faces will be triangulated and exploded and cuts will be processed)
  #graph: FOLD = {};

  // used internally. when a new graph is loaded this will trigger
  // the vertex and element arrays to be rebuilt
  #graphDidLoad: number = $state(0);

  // this graph for rendering and the source graph are not isomorphic,
  // this maps this graph's vertices (index) to the vertex index from
  // the source graph (value).
  #vertices_map: number[] = [];

  #effects: (() => void)[];

  program: WebGLProgram | undefined = $derived.by(() => {
    if (!this.viewport.gl) { return undefined; }
    try {
      // console.log("FoldedFormFaces create new program");
      switch (this.viewport.version) {
        case 1:
          return createProgram(this.viewport.gl, model_100_vert, model_100_frag);
        case 2:
        default:
          return createProgram(this.viewport.gl, model_300_vert, model_300_frag);
      }
    } catch {
      return undefined;
    }
  });

  vertexArrays: VertexArray[] = $derived.by(() => {
    if (!this.viewport.gl || !this.program) { return []; }
    const internalUpdate = this.#graphDidLoad;
    const reset = this.viewport.embedding?.graphUpdate.reset;
    const structural = this.viewport.embedding?.graphUpdate.structural;
    // console.log("FOLDED_FORM_FACES: vertexArrays: deriving new vertex arrays");
    return makeFoldedVertexArrays(
      this.viewport.gl,
      this.program,
      this.#graph ?? {},
      { showTriangulation: this.showTriangulation })
  });

  elementArrays: ElementArray[] = $derived.by(() => {
    if (!this.viewport.gl) { return []; }
    const internalUpdate = this.#graphDidLoad;
    const reset = this.viewport.embedding?.graphUpdate.reset;
    const structural = this.viewport.embedding?.graphUpdate.structural;
    // console.log("FOLDED_FORM_FACES: elementArrays: deriving new vertex arrays");
    return makeFoldedElementArrays(
      this.viewport.gl,
      this.viewport.version,
      this.#graph ?? {});
  });

  // enable DEPTH_TEST only if embedding has a layer order
  flags: number[] = $derived.by(() => {
    if (!this.viewport.gl) { return []; }
    return this.viewport.embedding?.attributes.hasLayerOrder
      ? [this.viewport.gl.DEPTH_TEST]
      : [];
  });

  #uniformInputs = $derived.by(() => ({
    projectionMatrix: this.viewport.view.projection,
    modelViewMatrix: this.viewport.view.modelView,
    frontColor: this.viewport.style.frontColor,
    backColor: this.viewport.style.backColor,
    outlineColor: this.viewport.style.outlineColor,
    strokeWidth: this.viewport.style.strokeWidth,
    opacity: this.viewport.style.opacity,
    // canvas: this.viewport.domElement,
  }));

  uniforms = $derived(makeUniforms(this.#uniformInputs));

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.#effects = [
      this.#deleteVertexArrays(),
      this.#deleteElementArrays(),
      this.#deleteProgram(),
      this.#effectLoadGraph(),
      this.#effectUpdateVertexBuffers(),
    ];
  }

  dealloc(): void {
    this.#effects.forEach((cleanup) => cleanup());
  }

  // triggered by:
  // - some of the graph updates
  // - this.viewport.embedding?.graph ($derived)
  // - this.viewport.style.layersNudge
  #effectLoadGraph(): () => void {
    return $effect.root(() => {
      $effect(() => {
        // console.log("FoldedFormFaces: effectLoadGraph()")
        const reset = this.viewport.embedding?.graphUpdate.reset;
        const structural = this.viewport.embedding?.graphUpdate.structural;
        const { graph, vertices_map } = prepareForRendering(
          this.viewport.embedding?.graph ?? {},
          { earcut, layerNudge: this.viewport.style.layersNudge },
        );
        this.#vertices_map = vertices_map;
        this.#graph = graph;
        this.#graphDidLoad++;
      });
      return () => { };
    });
  }

  #effectUpdateVertexBuffers(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const watch = this.viewport.embedding?.graphUpdate.isomorphic.coords;
        untrack(() => {
          // this follows a similar formula to the "set graph effect",
          // we grab the graph from the embedding (not from the local copy),
          // using the translation maps that were created when the graph was
          // prepared for rendering, update the (rendered) graph's coordinates
          // referencing the corresponding indices in the source graph via the maps.

          const graph = this.viewport.embedding?.graph ?? {};
          const positions = this.vertexArrays[0]?.data;
          const normals = this.vertexArrays[1]?.data;
          const dimension = this.vertexArrays[0]?.length ?? 3;
          if (!positions || !graph.vertices_coords) { return; }

          // either [0, 1] or [0, 1, 2] for 2D or 3D
          const indices = Array.from(Array(dimension)).map((_, i) => i);

          // ensure vertices coords are 2D or 3D, fill with 0 if needed
          const vertices_coords = graph.vertices_coords
            .map((coord) => indices.map(i => coord[i] ?? 0));

          this.#vertices_map.forEach((oldI, newI) => {
            indices.forEach(i => {
              positions[newI * dimension + i] = vertices_coords[oldI][i];
            });
          });

          const vertices_coords3 = dimension === 3
            ? vertices_coords
            : vertices_coords.map(([x, y]) => [x, y, 0]);

          const vertices_normal = makeVerticesNormal({
            vertices_coords: vertices_coords3,
            faces_vertices: graph.faces_vertices,
          });

          this.#vertices_map.forEach((oldI, newI) => {
            indices.forEach(i => {
              normals[newI * dimension + i] = vertices_normal[oldI][i];
            });
          });
        });
        // this will trigger a re-draw
        // this is the reactive object which the draw method is watching
        this.vertexArrays = [...this.vertexArrays];
      });
      // empty
      return () => { };
    })
  }

  #deleteProgram(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = this.program;
      });
      return () => {
        if (this.program && this.viewport.gl) {
          this.viewport.gl.deleteProgram(this.program);
        }
      };
    });
  }

  #deleteVertexArrays(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = this.vertexArrays;
      });
      return () => {
        if (this.viewport.gl) {
          this.vertexArrays.forEach(v => v.buffer && this.viewport.gl?.deleteBuffer(v.buffer));
        }
      };
    });
  }

  #deleteElementArrays(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = this.elementArrays;
      });
      return () => {
        if (this.viewport.gl) {
          this.elementArrays.forEach(e => e.buffer && this.viewport.gl?.deleteBuffer(e.buffer));
        }
      };
    });
  }
}

