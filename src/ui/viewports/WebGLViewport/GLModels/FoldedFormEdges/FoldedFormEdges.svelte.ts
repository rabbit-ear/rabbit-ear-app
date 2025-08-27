import type { WebGLViewport } from "../../WebGLViewport.svelte.ts";
import type { ElementArray, GLModel, VertexArray } from "../../GLModel.ts";
import { createProgram } from "rabbit-ear/webgl/general/webgl.js";
import { dark, light } from "rabbit-ear/webgl/general/colors.js";
import { makeUniforms } from "./uniforms.ts";
import {
  makeThickEdgesVertexArrays,
  makeThickEdgesElementArrays,
} from "./arrays.js";
import simple_100_frag from "./shaders/simple-100.frag?raw";
import simple_300_frag from "./shaders/simple-300.frag?raw";
import thick_edges_100_vert from "./shaders/thick-edges-100.vert?raw";
import thick_edges_300_vert from "./shaders/thick-edges-300.vert?raw";
import type { FOLD } from "rabbit-ear/types.js";

export class FoldedFormEdges implements GLModel {
  viewport: WebGLViewport;

  showTriangulation?: boolean = $state(false);

  // we don't need to explode the graph,
  // the original unmodified is good
  // #graph: FOLD = $derived.by(() => this.viewport.embedding?.graph ?? {});
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
          return createProgram(this.viewport.gl, thick_edges_100_vert, simple_100_frag)
        case 2:
        default:
          return createProgram(this.viewport.gl, thick_edges_300_vert, simple_300_frag);
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
    return makeThickEdgesVertexArrays(
      this.viewport.gl,
      this.program,
      this.#graph ?? {},
      { assignment_color: this.viewport.style.darkMode ? { ...dark } : { ...light } });
  });

  elementArrays: ElementArray[] = $derived.by(() => {
    if (!this.viewport.gl) { return []; }
    const internalUpdate = this.#graphDidLoad;
    const reset = this.viewport.embedding?.graphUpdate.reset;
    const structural = this.viewport.embedding?.graphUpdate.structural;
    const isomorphic = this.viewport.embedding?.graphUpdate.isomorphic.coords;
    return makeThickEdgesElementArrays(
      this.viewport.gl,
      this.viewport.version,
      this.#graph ?? {});
  });

  flags: number[] = $derived.by(() => this.viewport.gl
    ? [this.viewport.gl.DEPTH_TEST]
    : []);

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
        this.#graph = this.viewport.embedding?.graph ?? {};
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

