import type { FOLD, WebGLModel } from "rabbit-ear/types.js";
import earcut from "earcut";
import { creasePattern } from "rabbit-ear/webgl/creasePattern/models.js";
import { foldedForm } from "rabbit-ear/webgl/foldedForm/models.js";
// import { worldAxes } from "./Programs/WorldAxes/models.ts";
import type { WebGLViewport } from "./WebGLViewport.svelte.js";
// import { touchIndicators } from "rabbit-ear/webgl/touches/models.js";
// import { deallocModel } from "rabbit-ear/webgl/general/model.js";
import { dark, light } from "rabbit-ear/webgl/general/colors.js";
import { deallocModel } from "./GLModel.ts";
import { RenderStyle } from "../types.js";

// type WebGLModel = {
//   program,
//   vertexArrays;
//   elementArrays;
//   flags: [gl.DEPTH_TEST],
//   makeUniforms,
// };

type WebGLProgram = {
  model: WebGLModel;
  uniforms: { [key: string]: any };
  options: { [key: string]: any }
}

export class Models {
  viewport: WebGLViewport;

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
  }

  graph?: FOLD = $derived.by(() => this.viewport.model?.graph);

  // outlineColor = $derived.by(() => this.viewport.style.darkMode ? "white" : "black");

  // glModels: ((
  //   gl: WebGLRenderingContext | WebGL2RenderingContext,
  //   version: number,
  //   graph: FOLD,
  //   options?: object
  // ) => void)[] = $state([]);

  programs: WebGLProgram[] = [];

  // these are options needed only during the draw calls, and can be
  // modified and only trigger another draw call, the models do not
  // need to be re-initialized.
  uniformOptions = $derived.by(() => ({
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

  // these are options needed at the initialization of the geometry
  // and data arrays, updating this will trigger a re-init of the models
  programOptions = $derived.by(() => ({
    ...(this.viewport.style.darkMode ? dark : light),
    layerNudge: this.viewport.style.layersNudge,
    outlines: this.viewport.style.showFoldedFaceOutlines,
    edges: this.viewport.style.showFoldedCreases,
    faces: this.viewport.style.showFoldedFaces,
    earcut,
  }));

  models: WebGLModel[] = $derived.by(() => {
    try {
      if (!this.viewport.gl) { return []; }
      //const startTime = performance.now();
      // todo: need to delete buffers and programs (call deallocModels()).
      //untrack(() => deallocModels());
      const models =
        this.viewport.style.renderStyle === RenderStyle.creasePattern
          ? [
            ...creasePattern(this.viewport.gl, this.viewport.version, this.graph, this.programOptions),
            // ...worldAxes(this.viewport.gl),
            // ...touchIndicators(gl, programOptions),
          ]
          : [
            ...foldedForm(this.viewport.gl, this.viewport.version, this.graph, this.programOptions),
            // ...worldAxes(this.viewport.gl),
            // ...touchIndicators(gl, programOptions),
          ];
      // remove the one flag that is on by default: DepthTest.
      // this nicely renders the transparent faces and prevents z-fighting
      if (this.viewport.style.opacity < 1.0) {
        models.forEach((model) => (model.flags = []));
      }
      //console.log("WebGL make models (ms):", performance.now() - startTime);
      return models;
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  unbindTool(): void {

  }

  dealloc(): void {
    this.models.forEach((model) => {
      if (this.viewport.gl) { deallocModel(this.viewport.gl, model); }
    });
  }
}
