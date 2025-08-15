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

export class FoldedFormFaces implements GLModel {
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

  showTriangulation?: boolean = $state(false);

  // gotta use this one
  // this makes an "exploded" FOLD graph
  // graph: FOLD = $derived.by(() => this.viewport.model?.graph ?? {});
  graph: FOLD = $derived.by(() => prepareForRendering(
    this.viewport.model?.graph ?? {},
    { earcut, layerNudge: this.viewport.style.layersNudge },
  ));

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

  vertexArrays: VertexArray[] = $derived.by(() => this.viewport.gl && this.program
    ? makeFoldedVertexArrays(
      this.viewport.gl,
      this.program,
      this.graph ?? {},
      { showTriangulation: this.showTriangulation })
    : []);

  elementArrays: ElementArray[] = $derived.by(() => this.viewport.gl
    ? makeFoldedElementArrays(
      this.viewport.gl,
      this.viewport.version,
      this.graph ?? {})
    : []);

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

