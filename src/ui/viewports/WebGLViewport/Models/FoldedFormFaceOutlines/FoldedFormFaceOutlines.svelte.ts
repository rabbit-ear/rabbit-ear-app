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

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.effects = [
      this.#deleteProgram(),
      this.#deleteVertexArrays(),
      this.#deleteElementArrays(),
    ];
  }

  dealloc(): void {
    this.effects.forEach((cleanup) => cleanup());
  }

  // should this be in there?
  // showTriangulation?: boolean;
  programOptions = $derived.by(() => ({
    // ...(this.viewport.style.darkMode ? dark : light),
    layerNudge: this.viewport.style.layersNudge,
    // outlines: this.viewport.style.showFoldedFaceOutlines,
    // edges: this.viewport.style.showFoldedCreases,
    // faces: this.viewport.style.showFoldedFaces,
    earcut,
  }));

  showTriangulation?: boolean = $state(false);

  // gotta use this one
  // this makes an "exploded" FOLD graph
  graph: FOLD = $derived.by(() => prepareForRendering(
    this.viewport.model?.graph ?? {},
    { earcut, layerNudge: this.viewport.style.layersNudge },
  ));
  // .by(() => prepareForRendering(this.viewport.model?.graph, this.programOptions));

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

  vertexArrays: VertexArray[] = $derived.by(() => this.viewport.gl && this.program
    ? makeFoldedVertexArrays(
      this.viewport.gl,
      this.program,
      this.graph ?? {},
      // this.programOptions)
      { showTriangulation: this.showTriangulation })
    : []);

  elementArrays: ElementArray[] = $derived.by(() => this.viewport.gl
    ? makeFoldedElementArrays(
      this.viewport.gl,
      this.viewport.version,
      this.graph ?? {})
    : []);

  // flags: number[] = $state([]);
  flags: number[] = $derived.by(() => this.viewport.gl
    ? [this.viewport.gl.DEPTH_TEST]
    : []);

  uniformInputs = $derived.by(() => ({
    projectionMatrix: this.viewport.view.projection,
    modelViewMatrix: this.viewport.view.modelView,
    // canvas: this.viewport.domElement,
    frontColor: this.viewport.style.frontColor,
    backColor: this.viewport.style.backColor,
    outlineColor: this.viewport.style.outlineColor,
    strokeWidth: this.viewport.style.strokeWidth,
    opacity: this.viewport.style.opacity,
  }));

  uniforms = $derived(makeUniforms(this.uniformInputs));

  effects: (() => void)[];

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

  #deleteVertexArrays(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const vas = this.vertexArrays;
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
        const eas = this.elementArrays;
      });
      return () => {
        if (this.viewport.gl) {
          this.elementArrays.forEach(e => e.buffer && this.viewport.gl?.deleteBuffer(e.buffer));
        }
      };
    });
  }
}

