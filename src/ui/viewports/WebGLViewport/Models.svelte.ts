import type { FOLD, WebGLModel } from "rabbit-ear/types.js";
import earcut from "earcut";
import { creasePattern } from "rabbit-ear/webgl/creasePattern/models.js";
import { foldedForm } from "rabbit-ear/webgl/foldedForm/models.js";
import { worldAxes } from "../../Components/WebGL/WorldAxes/models";
import type { WebGLViewport } from "./WebGLViewport.svelte.js";
// import { touchIndicators } from "rabbit-ear/webgl/touches/models.js";
// import { deallocModel } from "rabbit-ear/webgl/general/model.js";
import { dark, light } from "rabbit-ear/webgl/general/colors.js";

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

  frontColor = $derived
    .by(() => this.viewport.style.opacity === 1 ? this.viewport.style.frontColor : "#999");
  backColor = $derived
    .by(() => this.viewport.style.opacity === 1 ? this.viewport.style.backColor : "#999");
  outlineColor = $derived
    .by(() => this.viewport.style.opacity === 1 ? this.viewport.style.outlineColor : "white");
  cpColor = $derived.by(() => this.viewport.style.darkMode ? "#111111" : "white");

  uniformOptions = $derived.by(() => ({
    projectionMatrix: this.viewport.view.projection,
    modelViewMatrix: this.viewport.view.modelView,
    canvas: this.viewport.domElement,
    // frontColor: this.viewport.style.frontColor,
    // backColor: this.viewport.style.backColor,
    // outlineColor: this.viewport.style.outlineColor,
    frontColor: this.frontColor,
    backColor: this.backColor,
    outlineColor: this.outlineColor,
    cpColor: this.cpColor,
    strokeWidth: this.viewport.style.strokeWidth,
    opacity: this.viewport.style.opacity,
  }));

  showFoldedFaceOutlines = true;
  showFoldedCreases = false;
  showFoldedFaces = true;

  programOptions = $derived.by(() => ({
    ...(this.viewport.style.darkMode ? dark : light),
    layerNudge: this.viewport.style.layersNudge,
    outlines: this.showFoldedFaceOutlines,
    edges: this.showFoldedCreases,
    faces: this.showFoldedFaces,
    earcut,
  }));

  models: WebGLModel[] = $derived.by(() => {
    try {
      if (!this.viewport.gl) { return []; }
      //const startTime = performance.now();
      // todo: need to delete buffers and programs (call deallocModels()).
      //untrack(() => deallocModels());
      const models =
        this.viewport.style.renderStyle === "creasePattern"
          ? [
            ...creasePattern(this.viewport.gl, this.viewport.version, this.graph, this.programOptions),
            ...worldAxes(this.viewport.gl),
            // ...touchIndicators(gl, programOptions),
          ]
          : [
            ...foldedForm(this.viewport.gl, this.viewport.version, this.graph, this.programOptions),
            ...worldAxes(this.viewport.gl),
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
}
