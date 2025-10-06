import type { WebGLViewport } from "../../WebGLViewport.svelte.ts";
import type { ElementArray, GLModel, VertexArray } from "../../GLModel.ts";
import { createProgram } from "rabbit-ear/webgl/general/webgl.js";
import { makeUniforms } from "./uniforms.ts";
import outlined_model_100_vert from "./shaders/outlined-model-100.vert?raw";
import outlined_model_100_frag from "./shaders/outlined-model-100.frag?raw";
import outlined_model_300_vert from "./shaders/outlined-model-300.vert?raw";
import outlined_model_300_frag from "./shaders/outlined-model-300.frag?raw";
import { RenderStyle } from "../../../types.ts";

export class FoldedFormFaceOutlines implements GLModel {
  viewport: WebGLViewport;

  showTriangulation?: boolean = $state(false);

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
    return [
      {
        location: this.viewport.gl?.getAttribLocation(this.program, "v_position"),
        buffer: this.viewport.gl?.createBuffer(),
        type: this.viewport.gl?.FLOAT,
        length: 3,
        data: this.viewport.rendering.folded.vertexArrayVertices3,
      },
      {
        location: this.viewport.gl?.getAttribLocation(this.program, "v_normal"),
        buffer: this.viewport.gl?.createBuffer(),
        type: this.viewport.gl?.FLOAT,
        length: 3,
        data: this.viewport.rendering.folded.vertexArrayVerticesNormal3,
      },
      {
        location: this.viewport.gl?.getAttribLocation(this.program, "v_barycentric"),
        buffer: this.viewport.gl?.createBuffer(),
        type: this.viewport.gl?.FLOAT,
        length: 3,
        data: this.viewport.rendering.folded.vertexArrayVerticesBarycentric3,
      },
    ].filter((el) => el.location !== -1)
  });

  elementArrays: ElementArray[] = $derived.by(() => {
    if (!this.viewport.gl) { return []; }
    return [{
      mode: this.viewport.gl?.TRIANGLES,
      buffer: this.viewport.gl?.createBuffer(),
      data: this.viewport.rendering.folded.elementArrayFaces,
    }];
  });

  // enable DEPTH_TEST only if embedding has a layer order
  flags: number[] = $derived.by(() => {
    if (!this.viewport.gl) { return []; }
    return this.viewport.style.renderStyle === RenderStyle.translucent
      ? []
      : [this.viewport.gl.DEPTH_TEST];
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

