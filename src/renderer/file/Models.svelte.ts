import type { FOLD } from "rabbit-ear/types.d.ts";
import { isFoldedForm } from "rabbit-ear/fold/spec.js";
import { makeVerticesCoordsFolded } from "rabbit-ear/graph/vertices/folded.js";
import { FileManager } from "./FileManager.svelte";
import type { Geometry } from "./Geometry.svelte";

export interface IModel {
  //set frame(frame: FOLD);
  //#graph: FOLD;
  //vertices_coordsSimulator: [number, number, number][];
  //vertices_coordsFolded: [number, number, number][];
  //faceOrders: [number, number, number][];
  fold: FOLD;
}

class CreasePatternModel implements IModel {
  #models: Models;
  //#fileManager: FileManager;
  //#frame: FOLD = $derived.by(() => this.#fileManager.file.graph);
  #frame: FOLD = $derived.by(() => this.#models.frame);
  #isFoldedForm: boolean = $derived(isFoldedForm(this.#frame));

  // todo
  snapPoints: [number, number][] = $state([]);

  //constructor(fileManager: FileManager) {
  constructor(models: Models) {
    this.#models = models;
    //this.#fileManager = fileManager;
  }

  get geometry(): Geometry {
    return this.#models.geometry;
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

  constructor(models: Models) {
    this.#models = models;
  }

  get geometry(): Geometry {
    return this.#models.geometry;
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

  get geometry(): Geometry {
    return this.#models.geometry;
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
  geometry: Geometry = $derived.by(() => this.fileManager.file?.geometry);

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
