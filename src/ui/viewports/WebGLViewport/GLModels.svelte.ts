import type { WebGLViewport } from "./WebGLViewport.svelte.js";
// import { touchIndicators } from "rabbit-ear/webgl/touches/models.js";
import { deallocModel } from "./GLModel.ts";
import type { GLModel } from "./GLModel.ts";
import { WorldAxes } from "./Models/WorldAxes/WorldAxes.svelte.ts";
import { CreasePatternEdges } from "./Models/CreasePatternEdges/CreasePatternEdges.svelte.ts";
import { CreasePatternFaces } from "./Models/CreasePatternFaces/CreasePatternFaces.svelte.ts";
import { FoldedFormFaces } from "./Models/FoldedFormFaces/FoldedFormFaces.svelte.ts";
import { FoldedFormFaceOutlines } from "./Models/FoldedFormFaceOutlines/FoldedFormFaceOutlines.svelte.ts";
import { FoldedFormEdges } from "./Models/FoldedFormEdges/FoldedFormEdges.svelte.ts";

export class GLModels {
  viewport: WebGLViewport;

  worldAxes: WorldAxes;
  cpEdges: CreasePatternEdges;
  cpFaces: CreasePatternFaces;
  foldedFormFaces: FoldedFormFaces;
  foldedFormFaceOutlines: FoldedFormFaceOutlines;
  foldedFormEdges: FoldedFormEdges;

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.worldAxes = new WorldAxes(this.viewport);
    this.cpEdges = new CreasePatternEdges(this.viewport);
    this.cpFaces = new CreasePatternFaces(this.viewport);
    this.foldedFormFaces = new FoldedFormFaces(this.viewport);
    this.foldedFormFaceOutlines = new FoldedFormFaceOutlines(this.viewport);
    this.foldedFormEdges = new FoldedFormEdges(this.viewport);
  }

  get models(): GLModel[] {
    return [
      this.worldAxes,
      this.cpFaces,
      this.cpEdges,
      this.foldedFormFaces,
      this.foldedFormFaceOutlines,
      this.foldedFormEdges,
    ];
  }

  unbindTool(): void {

  }

  dealloc(): void {
    this.models.forEach((model) => {
      if (this.viewport.gl) { deallocModel(this.viewport.gl, model); }
    });
  }
}

