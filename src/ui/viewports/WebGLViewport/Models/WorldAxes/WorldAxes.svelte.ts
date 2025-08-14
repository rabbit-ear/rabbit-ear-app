import type { WebGLViewport } from "../../WebGLViewport.svelte.ts";
import { createProgram } from "rabbit-ear/webgl/general/webgl.js";
import simple_100_vert from "./shaders/simple-100.vert?raw";
import simple_100_frag from "./shaders/simple-100.frag?raw";
import { makeUniforms } from "./uniforms.ts";
import type { ElementArray, GLModel, VertexArray } from "../../GLModel.ts";

const makeVertexArrays = (gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram) => [
  {
    location: gl.getAttribLocation(program, "v_position"),
    buffer: gl.createBuffer(),
    type: gl.FLOAT,
    length: 3,
    data: new Float32Array([1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1]),
  },
];

const makeElementArrays = (gl: WebGLRenderingContext | WebGL2RenderingContext) => [
  {
    mode: gl.LINES,
    buffer: gl.createBuffer(),
    data: new Uint32Array([0, 1, 2, 3, 4, 5]),
  },
];

export class WorldAxes implements GLModel {
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

  programOptions = {};

  program: WebGLProgram | undefined = $derived.by(() => {
    try {
      if (!this.viewport.gl) { return undefined; }
      return createProgram(this.viewport.gl, simple_100_vert, simple_100_frag);
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

  // flags: [], // flags: [gl.DEPTH_TEST],
  flags: number[] = $state([]);

  uniformInputs = $derived.by(() => ({
    projectionMatrix: this.viewport.view.projection,
    modelViewMatrix: this.viewport.view.modelView,
    origin: [0, 0, 0],
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
