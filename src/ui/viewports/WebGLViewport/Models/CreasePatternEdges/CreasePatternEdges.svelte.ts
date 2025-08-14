import earcut from "earcut";
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

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
  }

  programOptions = $derived.by(() => ({
    ...(this.viewport.style.darkMode ? dark : light),
    layerNudge: this.viewport.style.layersNudge,
    outlines: this.viewport.style.showFoldedFaceOutlines,
    edges: this.viewport.style.showFoldedCreases,
    faces: this.viewport.style.showFoldedFaces,
    earcut,
  }));

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
      this.viewport.model?.graph ?? {},
      this.programOptions)
    : []);

  elementArrays: ElementArray[] = $derived.by(() => this.viewport.gl
    ? makeCPEdgesElementArrays(
      this.viewport.gl,
      this.viewport.version,
      this.viewport.model?.graph)
    : []);

  // flags: [], // flags: [gl.DEPTH_TEST],
  flags: number[] = $state([]);

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
}
