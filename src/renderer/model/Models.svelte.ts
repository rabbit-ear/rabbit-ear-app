import type { FOLD, FOLDChildFrame } from "rabbit-ear/types.d.ts";
import type { Shape } from "../geometry/shapes.ts";
import type { ModelStyle } from "./ModelStyle.ts";
import { FileManager } from "../file/FileManager.svelte";
import { CreasePatternModel } from "./CreasePatternModel.svelte.ts";
import { FoldedFormModel } from "./FoldedFormModel.svelte.ts";
import { SimulatorModel } from "./SimulatorModel.svelte.ts";
import { flattenFrame } from "rabbit-ear/fold/frames.js";
import { reassembleFramesToFOLD } from "../general/fold.ts";
import { makeModelStyle } from "./ModelStyle.ts";

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
  fileManager: FileManager;

  activeFrame: number = $state(0);

  frames: FOLDChildFrame[] = $derived.by(() => this.fileManager.file?.frames);
  frame: FOLDChildFrame = $derived.by(() => this.frames[this.activeFrame]);

  framesFlat: FOLD[] = $derived.by(() => {
    try {
      const fold = reassembleFramesToFOLD($state.snapshot(this.fileManager.file?.frames));
      return this.fileManager.file?.frames.map((_, i) => flattenFrame(fold, i));
    } catch (error) {
      console.log(error);
      return [];
    }
  });

  //flatFrame: FOLD = $derived.by(() => this.framesFlat[this.fileManager.activeFrame]);
  flatFrame: FOLD = $derived.by(() => this.framesFlat[this.activeFrame]);

  // style related to the frames
  framesStyle: ModelStyle[] = $derived.by(() => this.framesFlat.map(makeModelStyle));
  //frameStyle: ModelStyle | undefined = $derived.by(
  //  () => this.framesStyle[this.activeFrame],
  //);

  isFoldedForm: boolean = $derived.by(
    //() => this.framesStyle[this.fileManager.activeFrame]?.isFoldedForm,
    () => this.framesStyle[this.activeFrame]?.isFoldedForm,
  );
  models: { [key: string]: IModel } = $state({});
  shapes: Shape[] = $derived.by(() => this.fileManager.file?.shapes);

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

  constructor(fileManager: FileManager) {
    this.fileManager = fileManager;
    const cp = new CreasePatternModel(this);
    const folded = new FoldedFormModel(this);
    const simulator = new SimulatorModel(this);
    this.models = {
      [cp.name]: cp,
      [folded.name]: folded,
      [simulator.name]: simulator,
    };
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
