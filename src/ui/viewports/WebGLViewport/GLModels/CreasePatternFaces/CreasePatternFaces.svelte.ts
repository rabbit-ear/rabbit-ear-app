import type { WebGLViewport } from "../../WebGLViewport.svelte.ts";
import type { ElementArray, GLModel, VertexArray } from "../../GLModel.ts";
import { createProgram } from "rabbit-ear/webgl/general/webgl.js";
import { makeUniforms } from "./uniforms.ts";
import {
  makeCPFacesVertexArrays,
  makeCPFacesElementArrays,
} from "./arrays.js";
import cp_100_vert from "./shaders/cp-100.vert?raw";
import cp_100_frag from "./shaders/cp-100.frag?raw";
import cp_300_vert from "./shaders/cp-300.vert?raw";
import cp_300_frag from "./shaders/cp-300.frag?raw";

export class CreasePatternFaces implements GLModel {
  viewport: WebGLViewport;

  program: WebGLProgram | undefined = $derived.by(() => {
    if (!this.viewport.gl) { return undefined; }
    try {
      switch (this.viewport.version) {
        case 1:
          return createProgram(this.viewport.gl, cp_100_vert, cp_100_frag);
        case 2:
        default:
          return createProgram(this.viewport.gl, cp_300_vert, cp_300_frag);
      }
    } catch {
      return undefined;
    }
  });

  vertexArrays: VertexArray[] = $derived.by(() => {
    if (!this.viewport.gl || !this.program) { return []; }
    const reset = this.viewport.embedding?.graphUpdate.reset;
    const structural = this.viewport.embedding?.graphUpdate.structural;
    const isomorphic = this.viewport.embedding?.graphUpdate.isomorphic.coords;
    return makeCPFacesVertexArrays(
      this.viewport.gl,
      this.program,
      this.viewport.embedding?.graph ?? {})
  });

  elementArrays: ElementArray[] = $derived.by(() => {
    if (!this.viewport.gl) { return []; }
    const reset = this.viewport.embedding?.graphUpdate.reset;
    const structural = this.viewport.embedding?.graphUpdate.structural;
    const isomorphic = this.viewport.embedding?.graphUpdate.isomorphic.coords;
    return makeCPFacesElementArrays(
      this.viewport.gl,
      this.viewport.version,
      this.viewport.embedding?.graph ?? {})
  });

  flags: number[] = [];

  #uniformInputs = $derived.by(() => ({
    projectionMatrix: this.viewport.view.projection,
    modelViewMatrix: this.viewport.view.modelView,
    cpColor: this.viewport.style.cpColor,
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
    ];
  }

  dealloc(): void {
    this.#effects.forEach((cleanup) => cleanup());
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
