import type { FOLD, FOLDChildFrame } from "rabbit-ear/types.d.ts";
import type { Shape } from "../geometry/shapes.ts";
import type { ModelStyle } from "./ModelStyle.ts";
import type { FrameStyle } from "../file/FrameStyle.ts";
import { FileManager } from "../file/FileManager.svelte";
import { CreasePatternModel } from "./CreasePatternModel.svelte.ts";
import { FoldedFormModel } from "./FoldedFormModel.svelte.ts";
import { SimulatorModel } from "./SimulatorModel.svelte.ts";

export interface IModel {
  name: string;

  // get the (compiled if necessary) FOLD graph
  fold: FOLD;

  style: ModelStyle;

  // other
  shapes: Shape[];

  // some optional properties that might exist
  snapPoints?: [number, number][] | [number, number, number][];
}

export class Models {
  #fileManager: FileManager;
  #frames: FOLDChildFrame[] = $derived.by(() => this.#fileManager.file?.frames);
  #framesFlat: FOLD[] = $derived.by(() => this.#fileManager.file?.framesFlat);
  #framesStyle: FrameStyle[] = $derived.by(() => this.#fileManager.file?.framesStyle);

  activeFrameIndex: number = $state(0);

  frame: FOLDChildFrame = $derived.by(() => this.#frames[this.activeFrameIndex]);
  frameFlat: FOLD = $derived.by(() => this.#framesFlat[this.activeFrameIndex]);
  frameStyle: FrameStyle = $derived.by(() => this.#framesStyle[this.activeFrameIndex]);

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
