import type { WebGLViewport } from "./WebGLViewport.svelte.js";
import type { GLModel } from "./GLModel.ts";
import { RenderStyle } from "../types.ts";
import { deallocModel } from "./GLModel.ts";
import GLModelClasses from "./GLModels/index.ts";

const FOLD_MODEL_NAMES = [
  "CreasePatternFaces",
  "CreasePatternEdges",
  "FoldedFormFaces",
  "FoldedFormFaceOutlines",
  "FoldedFormEdges",
];

export class GLModels {
  viewport: WebGLViewport;

  effects: (() => void)[];

  models: GLModel[] = $state([]);

  toolModel: GLModel | undefined = $state(undefined);

  #foldModelNames: string[] = $derived.by(() => {
    const isFoldedForm = this.viewport.style.renderStyle === RenderStyle.foldedForm
      || this.viewport.style.renderStyle === RenderStyle.translucent;
    const cpFaces = this.viewport.style.renderStyle === RenderStyle.creasePattern;
    const cpEdges = this.viewport.style.renderStyle === RenderStyle.creasePattern;
    const foldedFaces = isFoldedForm
      && this.viewport.style.showFoldedFaces
      && !this.viewport.style.showFoldedFaceOutlines;
    const foldedFaceOutlines = isFoldedForm
      && this.viewport.style.showFoldedFaces
      && this.viewport.style.showFoldedFaceOutlines;
    const foldedEdges = isFoldedForm
      && this.viewport.style.showFoldedCreases;
    return [
      cpFaces ? "CreasePatternFaces" : undefined,
      cpEdges ? "CreasePatternEdges" : undefined,
      foldedFaces ? "FoldedFormFaces" : undefined,
      foldedFaceOutlines ? "FoldedFormFaceOutlines" : undefined,
      foldedEdges ? "FoldedFormEdges" : undefined,
    ].filter(a => a !== undefined);
  });

  foldModels = $state([]);

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.effects = [
      this.#swapFOLDModels(),
      this.#watchToolModel(),
    ];
    this.models = [
      new GLModelClasses.WorldAxes(this.viewport),
      new GLModelClasses.TouchIndicator(this.viewport),
    ].filter(m => m !== undefined);
  }

  unbindTool(): void { }

  dealloc(): void {
    this.models.forEach((model) => {
      if (this.viewport.gl) { deallocModel(this.viewport.gl, model); }
    });
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

  removeModelsWithName(...modelNames: string[]) {
    this.models
      .filter(model => modelNames.includes(model.constructor.name))
      .forEach(model => deallocModel(this.viewport.gl, model));
    this.models = this.models
      .filter(model => !modelNames.includes(model.constructor.name));
  }

  // addModelWithName(modelName: string) {
  //   const ModelClass = GLModelClasses[modelName];
  //   if (!ModelClass) {
  //     console.warn(`Cannot find GLModel with named ${modelName}`);
  //     return;
  //   }
  //   // Model is already present
  //   if (this.models.find(el => el.constructor === ModelClass)) { return; }
  //   const instance = new ModelClass(this.viewport);
  //   this.models.push(instance);
  //   this.models.sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
  // }

  // removeModel(glModel: GLModel): boolean {
  //   const index = this.models.indexOf(glModel);
  //   if (index === -1) { return false; }
  //   deallocModel(this.viewport.gl, this.models[index]);
  //   this.models.splice(index, 1);
  //   return true;
  // }

  // clearModels(): void {
  //   // todo: do not dealloc the toolModel
  //   this.models.forEach(model => deallocModel(this.viewport.gl, model));
  //   // this.models = [];
  //   this.models = [
  //     this.toolModel,
  //     new GLModelClasses.WorldAxes(this.viewport),
  //     new GLModelClasses.TouchIndicator(this.viewport),
  //   ].filter(m => m !== undefined);
  // }

  #swapFOLDModels(): () => void {
    return $effect.root(() => {
      $effect(() => {
        this.removeModelsWithName(...FOLD_MODEL_NAMES);
        this.addModelsWithName(...this.#foldModelNames);
      });
      // empty
      return () => { };
    });
  }

  #watchToolModel(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (this.toolModel) {
          this.models.push(this.toolModel);
        }
      });
      // empty
      return () => { };
    });
  }
}

