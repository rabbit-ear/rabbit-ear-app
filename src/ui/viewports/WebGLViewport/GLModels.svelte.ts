import { untrack } from "svelte";
import type { WebGLViewport } from "./WebGLViewport.svelte.js";
import type { GLModel } from "./GLModel.ts";
import { RenderStyle } from "../types.ts";
import { deallocModel } from "./GLModel.ts";
import GLModelClasses from "./GLModels/index.ts";

export class GLModels {
  viewport: WebGLViewport;

  effects: (() => void)[];

  models: GLModel[] = $state([]);

  toolModel: GLModel | undefined = $state(undefined);

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.effects = [
      this.#swapModels(),
      // this.#swapFacesEdges(),
      // this.#swapFacesOutlines(),
    ];
  }

  unbindTool(): void { }

  dealloc(): void {
    this.models.forEach((model) => {
      if (this.viewport.gl) { deallocModel(this.viewport.gl, model); }
    });
  }

  addModelWithName(modelName: string) {
    const ModelClass = GLModelClasses[modelName];
    if (!ModelClass) {
      console.warn(`Cannot find GLModel with named ${modelName}`);
      return;
    }
    // Model is already present
    if (this.models.find(el => el.constructor === ModelClass)) { return; }
    const instance = new ModelClass(this.viewport);
    this.models.push(instance);
    this.models.sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
  }

  addModelsWithName(...modelNames: string[]) {
    const ModelClasses = Array.from(new Set(modelNames))
      .map(modelName => GLModelClasses[modelName])
      .filter(ModelClass => !this.models.find(el => el.constructor === ModelClass));
    const instances = ModelClasses.map(ModelClass => new ModelClass(this.viewport));
    this.models = this.models
      .concat(instances)
      .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
  }

  removeModel(glModel: GLModel): boolean {
    const index = this.models.indexOf(glModel);
    if (index === -1) { return false; }
    deallocModel(this.viewport.gl, this.models[index]);
    this.models.splice(index, 1);
    return true;
  }

  clearModels(): void {
    // todo: do not dealloc the toolModel
    this.models.forEach(model => deallocModel(this.viewport.gl, model));
    // this.models = [];
    this.models = [
      this.toolModel,
      new GLModelClasses.WorldAxes(this.viewport),
      new GLModelClasses.TouchIndicator(this.viewport),
    ].filter(m => m !== undefined);
  }

  #swapModels(): () => void {
    return $effect.root(() => {
      $effect(() => {
        console.log("swapping models", $state.snapshot(this.viewport.style.renderStyle));
        switch (this.viewport.style.renderStyle) {

          case RenderStyle.creasePattern:
            this.clearModels();
            this.addModelsWithName("CreasePatternFaces", "CreasePatternEdges");
            break;

          case RenderStyle.foldedForm:
            this.clearModels();
            this.addModelsWithName("FoldedFormEdges", "FoldedFormFaces", "FoldedFormFaceOutlines");
            break;

          case RenderStyle.translucent:
            this.clearModels();
            this.addModelsWithName("FoldedFormEdges", "FoldedFormFaces", "FoldedFormFaceOutlines");
            break;
        }
        untrack(() => { });
      });
      // empty
      return () => { };
    });
  }

  // #swapFacesEdges(): () => void {
  //   return $effect.root(() => {
  //     $effect(() => {
  //       if (this.viewport.style.showFoldedCreases) {
  //         untrack(() => {
  //           this.models = this.models
  //             .filter(model => model !== this.foldedFormEdges)
  //             .concat([this.foldedFormEdges]);
  //         });
  //       } else {
  //         untrack(() => {
  //           this.models = this.models
  //             .filter(model => model !== this.foldedFormEdges);
  //         });
  //       }
  //       untrack(() => { });
  //     });
  //     // empty
  //     return () => { };
  //   });
  // }
  //
  // #swapFacesOutlines(): () => void {
  //   return $effect.root(() => {
  //     $effect(() => {
  //       if (this.viewport.style.showFoldedFaceOutlines) {
  //         untrack(() => {
  //           this.models = this.models
  //             .filter(model => model !== this.foldedFormFaceOutlines)
  //             .concat([this.foldedFormFaceOutlines]);
  //         });
  //       } else {
  //         untrack(() => {
  //           this.models = this.models
  //             .filter(model => model !== this.foldedFormFaceOutlines);
  //         });
  //       }
  //     });
  //     // empty
  //     return () => { };
  //   });
  // }
}

