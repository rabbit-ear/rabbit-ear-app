import type { WebGLViewport } from "../../WebGLViewport.svelte.ts";
import type { ElementArray, GLModel, VertexArray } from "../../GLModel.ts";
import { createProgram } from "rabbit-ear/webgl/general/webgl.js";
import { dark, light } from "rabbit-ear/webgl/general/colors.js";
import { makeUniforms } from "./uniforms.ts";
import {
  makeCPEdgesVertexArrays,
  makeCPEdgesElementArrays,
} from "./arrays.js";
import thick_edges_100_vert from "./shaders/thick-edges-100.vert?raw";
import thick_edges_100_frag from "./shaders/thick-edges-100.frag?raw";
import thick_edges_300_vert from "./shaders/thick-edges-300.vert?raw";
import thick_edges_300_frag from "./shaders/thick-edges-300.frag?raw";

export class CreasePatternEdges implements GLModel {
  viewport: WebGLViewport;

  program: WebGLProgram | undefined = $derived.by(() => {
    if (!this.viewport.gl) { return undefined; }
    try {
      switch (this.viewport.version) {
        case 1:
          return createProgram(
            this.viewport.gl,
            thick_edges_100_vert,
            thick_edges_100_frag);
        case 2:
        default:
          return createProgram(
            this.viewport.gl,
            thick_edges_300_vert,
            thick_edges_300_frag);
      }
    } catch {
      return undefined;
    }
  });

  vertexArrays: VertexArray[] = $derived.by(() => this.viewport.gl && this.program
    ? makeCPEdgesVertexArrays(
      this.viewport.gl,
      this.program,
      this.viewport.embedding?.graph ?? {},
      this.viewport.style.darkMode ? { ...dark } : { ...light })
    : []);

  elementArrays: ElementArray[] = $derived.by(() => this.viewport.gl
    ? makeCPEdgesElementArrays(
      this.viewport.gl,
      this.viewport.version,
      this.viewport.embedding?.graph ?? {})
    : []);

  flags: number[] = $state([]);

  #uniformInputs = $derived.by(() => ({
    projectionMatrix: this.viewport.view.projection,
    modelViewMatrix: this.viewport.view.modelView,
    strokeWidth: this.viewport.style.strokeWidth,
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
