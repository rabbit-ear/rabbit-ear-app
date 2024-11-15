import type { FOLD } from "rabbit-ear/types.d.ts";
import { isFoldedForm } from "rabbit-ear/fold/spec.js";
import { makeVerticesCoordsFolded } from "rabbit-ear/graph/vertices/folded.js";
import { FileManager } from "./FileManager.svelte";
import type { Shape } from "../geometry/shapes.ts";

export interface IModel {
  // get the (compiled if necessary) FOLD graph
  fold: FOLD;

  // other
  shapes: Shape[];

  // some optional properties that might exist
  snapPoints?: [number, number][] | [number, number, number][];
}

class CreasePatternModel implements IModel {
  #models: Models;
  #frame: FOLD = $derived.by(() => this.#models.frame);
  #isFoldedForm: boolean = $derived(isFoldedForm(this.#frame));

  // todo
  snapPoints: [number, number][] = $state([]);

  constructor(models: Models) {
    this.#models = models;
  }

  get shapes(): Shape[] {
    return this.#models.shapes;
  }

  // it might be possible to "unfold" the vertices
  get fold(): FOLD {
    return this.#isFoldedForm ? {} : this.#frame;
    //return $state.snapshot(this.graph);
  }
}

class FoldedFormModel implements IModel {
  #models: Models;
  #frame: FOLD = $derived.by(() => this.#models.frame);
  #isFoldedForm: boolean = $derived(isFoldedForm(this.#frame));

  #vertices_coords: [number, number][] | [number, number, number][] = $derived.by(() => {
    if (this.#isFoldedForm) {
      return this.#frame?.vertices_coords || [];
    }
    try {
      return makeVerticesCoordsFolded(this.#frame);
    } catch (error) {
      //app.console.error(error);
      return [];
    }
  });

  // todo
  snapPoints: [number, number][] | [number, number, number][] = $state([]);

  constructor(models: Models) {
    this.#models = models;
  }

  get shapes(): Shape[] {
    return this.#models.shapes;
  }

  //faceOrders: [number, number, number][] = $state.raw([]);

  get fold(): FOLD {
    return {
      //...$state.snapshot(this.graph),
      ...this.#frame,
      vertices_coords: this.#vertices_coords,
      //faceOrders: this.faceOrders,
    };
  }
}

class SimulatorModel implements IModel {
  #models: Models;
  #frame: FOLD = $derived.by(() => this.#models.frame);
  #vertices_coords: [number, number, number][] = $state.raw([]);

  constructor(models: Models) {
    this.#models = models;
  }

  get shapes(): Shape[] {
    return this.#models.shapes;
  }

  get fold(): FOLD {
    return {
      //...$state.snapshot(this.graph),
      ...this.#frame,
      vertices_coords: this.#vertices_coords,
    };
  }
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
