import type { WebGLViewport } from "../WebGLViewport.svelte.ts";
import { dark, light } from "rabbit-ear/webgl/general/colors.js";
import { creasePattern } from "rabbit-ear/webgl/creasePattern/models.js";
import earcut from "earcut";
import type { GLModel } from "../../GLModel.ts";

export class CreasePatternFaces implements GLModel {
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
