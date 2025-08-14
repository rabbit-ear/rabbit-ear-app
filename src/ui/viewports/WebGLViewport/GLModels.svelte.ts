// import { creasePattern } from "rabbit-ear/webgl/creasePattern/models.js";
// import { foldedForm } from "rabbit-ear/webgl/foldedForm/models.js";
import type { WebGLViewport } from "./WebGLViewport.svelte.js";
// import { touchIndicators } from "rabbit-ear/webgl/touches/models.js";
import { deallocModel } from "./GLModel.ts";
import type { GLModel } from "./GLModel.ts";
import { WorldAxes } from "./Models/WorldAxes/WorldAxes.svelte.ts";
import { CreasePatternEdges } from "./Models/CreasePatternEdges/CreasePatternEdges.svelte.ts";

export class GLModels {
  viewport: WebGLViewport;

  cpEdges: CreasePatternEdges;
  worldAxes: WorldAxes;

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.worldAxes = new WorldAxes(this.viewport);
    this.cpEdges = new CreasePatternEdges(this.viewport);
  }

  get models(): GLModel[] {
    // return [this.worldAxes];
    return [this.worldAxes, this.cpEdges];
  }

  unbindTool(): void {

  }

  dealloc(): void {
    this.models.forEach((model) => {
      if (this.viewport.gl) { deallocModel(this.viewport.gl, model); }
    });
  }
}

