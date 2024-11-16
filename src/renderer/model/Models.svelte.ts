import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Shape } from "../geometry/shapes.ts";
import { FileManager } from "../file/FileManager.svelte";
import { CreasePatternModel } from "./CreasePatternModel.svelte.ts";
import { FoldedFormModel } from "./FoldedFormModel.svelte.ts";
import { SimulatorModel } from "./SimulatorModel.svelte.ts";

export interface IModel {
  // get the (compiled if necessary) FOLD graph
  fold: FOLD;

  // other
  shapes: Shape[];

  // some optional properties that might exist
  snapPoints?: [number, number][] | [number, number, number][];
}

export class Models {
  fileManager: FileManager;
  frame: FOLD = $derived.by(
    () => this.fileManager.file?.framesFlat[this.fileManager.file?.activeFrame],
  );
  models: IModel[] = $state([]);
  shapes: Shape[] = $derived.by(() => this.fileManager.file?.shapes);

  get cp(): IModel {
    return this.models[0];
  }
  get folded(): IModel {
    return this.models[1];
  }
  get simulator(): IModel {
    return this.models[2];
  }

  constructor(fileManager: FileManager) {
    this.fileManager = fileManager;
    this.models = [
      new CreasePatternModel(this),
      new FoldedFormModel(this),
      new SimulatorModel(this),
    ];
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
