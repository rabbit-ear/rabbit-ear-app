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
import outlined_model_100_vert from "./shaders/outlined-model-100.vert?raw";
import outlined_model_100_frag from "./shaders/outlined-model-100.frag?raw";
import outlined_model_300_vert from "./shaders/outlined-model-300.vert?raw";
import outlined_model_300_frag from "./shaders/outlined-model-300.frag?raw";
import type { FOLD } from "rabbit-ear/types.js";

export class FoldedFormFaceOutlines implements GLModel {
  viewport: WebGLViewport;

  showTriangulation?: boolean = $state(false);

  // the source graph on the embedding will be processed before being set to here.
  // these two graphs are not isomorphic (source and this one for rendering).
  // (faces will be triangulated and exploded and cuts will be processed)
  #graph: FOLD = {};

  // used internally to this class only.
  // when this.graph has been updated, this will increment.
  // the arrays (vertex, element) will rebuild if this changes
  #graphDidLoad: number = $state(0);

  program: WebGLProgram | undefined = $derived.by(() => {
    if (!this.viewport.gl) { return undefined; }
    try {
      switch (this.viewport.version) {
        case 1:
          return createProgram(this.viewport.gl, outlined_model_100_vert, outlined_model_100_frag)
        case 2:
        default:
          return createProgram(this.viewport.gl, outlined_model_300_vert, outlined_model_300_frag);
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
    const isomorphic = this.viewport.embedding?.graphUpdate.isomorphic.coords;
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
    const isomorphic = this.viewport.embedding?.graphUpdate.isomorphic.coords;
    return makeFoldedElementArrays(
      this.viewport.gl,
      this.viewport.version,
      this.#graph ?? {});
  });

  // enable DEPTH_TEST only if embedding has a layer order
  flags: number[] = $derived.by(() => {
    if (!this.viewport.gl) { return []; }
    return this.viewport.embedding?.attributes.layerOrder
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

  #effects: (() => void)[];

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.#effects = [
      this.#deleteProgram(),
      this.#deleteVertexArrays(),
      this.#deleteElementArrays(),
      this.#effectLoadGraph(),
    ];
  }

  dealloc(): void {
    this.#effects.forEach((cleanup) => cleanup());
  }

  // triggered by:
  // - any of the graph updates
  // - this.viewport.embedding?.graph ($derived)
  // - this.viewport.style.layersNudge
  #effectLoadGraph(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const reset = this.viewport.embedding?.graphUpdate.reset;
        const structural = this.viewport.embedding?.graphUpdate.structural;
        const isomorphic = this.viewport.embedding?.graphUpdate.isomorphic.coords;
        this.#graph = prepareForRendering(
          this.viewport.embedding?.graph ?? {},
          { earcut, layerNudge: this.viewport.style.layersNudge },
        );
        this.#graphDidLoad++;
      });
      return () => { };
    });
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

