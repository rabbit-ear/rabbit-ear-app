import type { FOLD, FOLDChildFrame } from "rabbit-ear/types.d.ts";
import type { Shape } from "../geometry/shapes.ts";
import type { IModel } from "./Model.svelte.ts";
import type { FrameStyle } from "./FrameStyle.ts";
import { FileManager } from "../file/FileManager.svelte.ts";
import { CreasePatternModel } from "./CreasePattern/CreasePatternModel.svelte.ts";
import { FoldedFormModel } from "./FoldedForm/FoldedFormModel.svelte.ts";
import { SimulatorModel } from "./Simulator/SimulatorModel.svelte.ts";

export class ModelManager {
  #fileManager: FileManager;
  #frames: FOLDChildFrame[] = $derived.by(() => this.#fileManager.file?.frames);
  #framesFlat: FOLD[] = $derived.by(() => this.#fileManager.file?.framesFlat);
  #framesStyle: FrameStyle[] = $derived.by(() => this.#fileManager.file?.framesStyle);

  activeFrameIndex: number = $state(0);

  frame: FOLDChildFrame = $derived.by(() => this.#frames[this.activeFrameIndex]);
  frameFlat: FOLD = $derived.by(() => this.#framesFlat[this.activeFrameIndex]);
  frameStyle: FrameStyle = $derived.by(() => this.#framesStyle[this.activeFrameIndex]);

  // if models are removed, they need to call their dealloc() method
  models: { [key: string]: IModel } = $state({});
  shapes: Shape[] = $derived.by(() => this.#fileManager.file?.shapes);

  constructor(fileManager: FileManager) {
    this.#fileManager = fileManager;
    const cp = new CreasePatternModel(this);
    const folded = new FoldedFormModel(this);
    const simulator = new SimulatorModel(this);
    this.models = {
      [cp.name]: cp,
      [folded.name]: folded,
      [simulator.name]: simulator,
    };
  }

  dealloc(): void {
    Object.values(this.models).forEach((model) => model?.dealloc());
    this.models = {};
  }

  getModelWithName(name: string): IModel | undefined {
    return this.models[name];
  }

  get cp(): IModel {
    return this.models.creasePattern;
  }
  get folded(): IModel {
    return this.models.foldedForm;
  }
  get simulator(): IModel {
    return this.models.simulator;
  }

  // this gets called when FileManager loads a new file
  newFileDidLoad(): void {
    this.activeFrameIndex = 0;
  }
}

//import { getShapesInRect, intersectAllShapes } from "../geometry/intersect.ts";
//export class Geometry {
//  shapes: Shape[] = $state([]);
//  #effects: (() => void)[] = [];
//
//  // snap points
//  //snapPoints: [number, number][] = $state([]);
//
//  #makeIntersectionsEffect(): () => void {
//    return $effect.root(() => {
//      $effect(() => {
//        this.snapPoints = intersectAllShapes(this.shapes);
//      });
//      return () => {
//        // empty
//      };
//    });
//  }
//
//  constructor() {
//    this.#effects = [this.#makeIntersectionsEffect()];
//  }
//
//  dealloc(): void {
//    this.#effects.forEach((fn) => fn());
//  }
//}
