import type { WebGLViewport } from "../../WebGLViewport.svelte.ts";
import { createProgram } from "rabbit-ear/webgl/general/webgl.js";
import touches_100_vert from "./shaders/touches-100.vert?raw";
import touches_100_frag from "./shaders/touches-100.frag?raw";
import { makeUniforms } from "./uniforms.ts";
import type { ElementArray, GLModel, VertexArray } from "../../GLModel.ts";
import {
  makeVertexArrays,
  makeElementArrays,
} from "./arrays.ts";
import { Touches } from "./Touches.svelte.ts";

export class TouchIndicator implements GLModel {
  viewport: WebGLViewport;
  touches: Touches;

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.effects = [
      this.#deleteProgram(),
      this.#deleteVertexArrays(),
      this.#deleteElementArrays(),
    ];

    this.touches = new Touches(this.viewport);
  }

  dealloc(): void {
    this.touches.dealloc();
    this.effects.forEach((cleanup) => cleanup());
  }

  program: WebGLProgram | undefined = $derived.by(() => {
    try {
      if (!this.viewport.gl) { return undefined; }
      return createProgram(this.viewport.gl, touches_100_vert, touches_100_frag);
    } catch {
      return undefined;
    }
  });

  vertexArrays: VertexArray[] = $derived.by(() => this.viewport.gl && this.program
    ? makeVertexArrays(this.viewport.gl, this.program)
    : []);

  elementArrays: ElementArray[] = $derived.by(() => this.viewport.gl
    ? makeElementArrays(this.viewport.gl)
    : []);

  flags: number[] = $state([]);

  uniformInputs = $derived.by(() => ({
    projectionMatrix: this.viewport.view.projection,
    modelViewMatrix: this.viewport.view.modelView,
    cursorScreen: this.touches.cursorScreen,
    cursorWorld: this.touches.cursorWorld,
    canvas: this.viewport.domElement,
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
