import earcut from "earcut";
import type { WebGLViewport } from "../../WebGLViewport.svelte.ts";
import type { ElementArray, GLModel, VertexArray } from "../../GLModel.ts";
import { prepareForRendering } from "rabbit-ear/graph/rendering.js";
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

export class FoldedFormFaces implements GLModel {
  viewport: WebGLViewport;

  showTriangulation?: boolean = $state(false);

  // ensure this is always set to the result of prepareForRendering
  // as this is an exploded graph (faces are triangulated and not isomorphic).
  graph: FOLD = {};

  effects: (() => void)[];

  vertexArrays: VertexArray[] = [];

  elementArrays: ElementArray[] = [];

  program: WebGLProgram | undefined = $derived.by(() => {
    if (!this.viewport.gl) { return undefined; }
    try {
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

  flags: number[] = $derived.by(() => this.viewport.gl
    ? [this.viewport.gl.DEPTH_TEST]
    : []);

  uniformInputs = $derived.by(() => ({
    projectionMatrix: this.viewport.view.projection,
    modelViewMatrix: this.viewport.view.modelView,
    frontColor: this.viewport.style.frontColor,
    backColor: this.viewport.style.backColor,
    outlineColor: this.viewport.style.outlineColor,
    strokeWidth: this.viewport.style.strokeWidth,
    opacity: this.viewport.style.opacity,
    // canvas: this.viewport.domElement,
  }));

  uniforms = $derived(makeUniforms(this.uniformInputs));

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;

    if (this.viewport.embedding?.graph) {
      console.log("constructor() loading initial graph and setting vertex arrays");
      this.graph = this.#loadGraph(this.viewport.embedding?.graph);
      this.vertexArrays = this.#constructVertexArrays(this.viewport.embedding?.graph);
      this.elementArrays = this.#constructElementArrays(this.viewport.embedding?.graph);
    }

    console.log("constructor() embedding graphUpdate", this.viewport.embedding?.graphUpdate);

    this.effects = [
      // this.#deleteVertexArrays(),
      // this.#deleteElementArrays(),
      this.#deleteProgram(),
      this.#effectSetGraph(),
      this.#effectCreateVertexBuffers(),
      this.#effectUpdateVertexBuffers(),
      this.#effectCreateElementBuffers(),
      // this.#effectUpdateElementBuffers(),
    ];
  }

  dealloc(): void {
    this.effects.forEach((cleanup) => cleanup());
  }

  #loadGraph(graph: FOLD): FOLD {
    return prepareForRendering(
      graph,
      { earcut, layerNudge: this.viewport.style.layersNudge },
    );
  }

  #constructVertexArrays(graph: FOLD): VertexArray[] {
    if (!this.viewport.gl || !this.program) { return []; }
    return makeFoldedVertexArrays(
      this.viewport.gl,
      this.program,
      graph,
      { showTriangulation: this.showTriangulation });
  }

  #deallocVertexArrays(): void {
    if (!this.viewport.gl || !this.vertexArrays) { return; }
    this.vertexArrays.forEach(v => v.buffer && this.viewport.gl?.deleteBuffer(v.buffer));
    this.vertexArrays = [];
  }

  #constructElementArrays(graph: FOLD): ElementArray[] {
    if (!this.viewport.gl) { return []; }
    return makeFoldedElementArrays(
      this.viewport.gl,
      this.viewport.version,
      graph);
  }

  #deallocElementArrays(): void {
    if (!this.viewport.gl) { return; }
    this.elementArrays.forEach(e => e.buffer && this.viewport.gl?.deleteBuffer(e.buffer));
    this.elementArrays = [];
  }

  #effectSetGraph(): () => void {
    return $effect.root(() => {
      $effect(() => {
        this.viewport.embedding?.graphUpdate;
        untrack(() => {
          this.graph = this.#loadGraph(this.viewport.embedding?.graph ?? {});
        });
      });
      return () => { };
    });
  }

  #effectCreateVertexBuffers(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const proceed = this.viewport.embedding?.graphUpdate.structural
          || this.viewport.embedding?.graphUpdate.reset;
        // console.log("createVertexBuffers effect", proceed);
        if (!proceed) { return; }
        // console.log("create vertex buffer inside effect");
        if (this.vertexArrays.length) { this.#deallocVertexArrays(); }
        untrack(() => {
          this.vertexArrays = this.#constructVertexArrays(this.graph ?? {});
        });
      });
      return () => { this.#deallocVertexArrays(); }
    });
  }

  #effectUpdateVertexBuffers(): () => void {
    return $effect.root(() => {
      $effect(() => {
        var proceed = this.viewport.embedding?.graphUpdate.isomorphic?.coords;
        if (!proceed) { return; }
        untrack(() => {
          const vertices_coords = this.graph.vertices_coords;
          if (!vertices_coords) { return; }
          const vertices_coords3 = vertices_coords
            .map((coord) => [coord[0] ?? 0, coord[1] ?? 0, coord[2] ?? 0]);
          const data = this.vertexArrays[0].data
          vertices_coords3.forEach((coords, i) => {
            data[i * 3 + 0] = coords[0];
            data[i * 3 + 1] = coords[1];
            data[i * 3 + 2] = coords[2];
          });
          // this.vertexArrays[0].data = new Float32Array(vertices_coords3.flat());
          // const vertices_normal = makeVerticesNormal({
          //   vertices_coords: vertices_coords3,
          //   faces_vertices: this.graph.faces_vertices,
          //   faces_normal,
          // });
        })
      });
      // empty
      return () => { };
    })
  }

  #effectCreateElementBuffers(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const proceed = this.viewport.embedding?.graphUpdate.structural
          || this.viewport.embedding?.graphUpdate.reset;
        if (!proceed) { return; }
        // console.log("create element buffer inside effect");
        if (this.elementArrays.length) { this.#deallocElementArrays(); }
        untrack(() => {
          this.elementArrays = this.#constructElementArrays(this.graph ?? {});
        });
      });
      return () => { this.#deallocElementArrays(); }
    });
  }

  // #effectUpdateElementBuffers(): () => void {
  //   return $effect.root(() => {
  //     $effect(() => {
  //       if (!this.viewport.embedding?.graphUpdate?.isomorphic?.coords) { return; }
  //       console.log("update element buffer inside effect");
  //     });
  //     return () => { this.#deallocElementArrays(); }
  //   })
  // }

  #deleteProgram(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const program = this.program;
      });
      return () => {
        if (this.program && this.viewport.gl) {
          this.viewport.gl.deleteProgram(this.program);
        }
      };
    });
  }
}

