import type { WebGLViewport } from "../../WebGLViewport.svelte.ts";
import type { ElementArray, GLModel, VertexArray } from "../../GLModel.ts";
import { createProgram } from "rabbit-ear/webgl/general/webgl.js";
import { makeUniforms } from "./uniforms.ts";
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

  vertexArrays: VertexArray[] = $derived.by(() => {
    if (!this.viewport.gl || !this.program) { return []; }
    return [
      {
        location: this.viewport.gl?.getAttribLocation(this.program, "v_position"),
        buffer: this.viewport.gl?.createBuffer(),
        type: this.viewport.gl?.FLOAT,
        length: 2,
        data: this.viewport.rendering.cp.vertexArrayThickEdgesVerticesCoords,
      },
      {
        location: this.viewport.gl?.getAttribLocation(this.program, "v_color"),
        buffer: this.viewport.gl?.createBuffer(),
        type: this.viewport.gl?.FLOAT,
        length: 3,
        data: this.viewport.rendering.cp.vertexArrayThickEdgesVerticesColor,
      },
      {
        location: this.viewport.gl?.getAttribLocation(this.program, "edge_vector"),
        buffer: this.viewport.gl?.createBuffer(),
        type: this.viewport.gl?.FLOAT,
        length: 2,
        data: this.viewport.rendering.cp.vertexArrayThickEdgesVerticesEdgesVector,
      },
      {
        location: this.viewport.gl?.getAttribLocation(this.program, "edge_foldAngle"),
        buffer: this.viewport.gl?.createBuffer(),
        type: this.viewport.gl?.FLOAT,
        length: 1,
        data: this.viewport.rendering.cp.vertexArrayThickEdgesVerticesFoldAngle,
      },
      {
        location: this.viewport.gl?.getAttribLocation(this.program, "vertex_vector"),
        buffer: this.viewport.gl?.createBuffer(),
        type: this.viewport.gl?.FLOAT,
        length: 2,
        data: this.viewport.rendering.cp.vertexArrayThickEdgesVerticesVector,
      },
    ].filter((el) => el.location !== -1);
  });

  elementArrays: ElementArray[] = $derived.by(() => {
    if (!this.viewport.gl) { return []; }
    return [{
      mode: this.viewport.gl?.TRIANGLES,
      buffer: this.viewport.gl?.createBuffer(),
      data: this.viewport.rendering.cp.elementArrayThickEdges,
    }];
  });

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
      $effect(() => { const _ = this.program; });
      return () => {
        if (this.program && this.viewport.gl) {
          this.viewport.gl.deleteProgram(this.program);
        }
      };
    });
  }

  #deleteVertexArrays(): () => void {
    return $effect.root(() => {
      $effect(() => { const _ = this.vertexArrays; });
      return () => {
        if (this.viewport.gl) {
          this.vertexArrays.forEach(v => v.buffer && this.viewport.gl?.deleteBuffer(v.buffer));
        }
      };
    });
  }

  #deleteElementArrays(): () => void {
    return $effect.root(() => {
      $effect(() => { const _ = this.elementArrays; });
      return () => {
        if (this.viewport.gl) {
          this.elementArrays.forEach(e => e.buffer && this.viewport.gl?.deleteBuffer(e.buffer));
        }
      };
    });
  }
}
