import type { WebGLViewport } from "../WebGLViewport.svelte.ts";
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

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    // this.flags = [this.viewport.gl.DEPTH_TEST];
    this.effects = [
      this.#deleteProgram(),
      this.#deleteVertexArrays(),
      this.#deleteElementArrays(),
    ];
  }

  dealloc(): void {
    this.effects.forEach((cleanup) => cleanup());
  }

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

  vertexArrays: VertexArray[] = $derived.by(() => this.viewport.gl && this.program
    ? makeCPFacesVertexArrays(
      this.viewport.gl,
      this.program,
      this.viewport.model?.graph ?? {})
    : []);

  elementArrays: ElementArray[] = $derived.by(() => this.viewport.gl
    ? makeCPFacesElementArrays(
      this.viewport.gl,
      this.viewport.version,
      this.viewport.model?.graph ?? {})
    : []);

  // this has to be initialized after the constructor is called
  // flags: number[] = []; // flags: [gl.DEPTH_TEST],
  flags: number[] = $derived.by(() => [this.viewport.gl?.DEPTH_TEST]);
  // flags: number[] = $state([this.viewport.gl.DEPTH_TEST]);

  uniformInputs = $derived.by(() => ({
    projectionMatrix: this.viewport.view.projection,
    modelViewMatrix: this.viewport.view.modelView,
    canvas: this.viewport.domElement,
    frontColor: this.viewport.style.frontColor,
    backColor: this.viewport.style.backColor,
    outlineColor: this.viewport.style.outlineColor,
    cpColor: this.viewport.style.cpColor,
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
