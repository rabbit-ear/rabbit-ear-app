import type { FOLD } from "rabbit-ear/types.d.ts";
import { isFoldedForm } from "rabbit-ear/fold/spec.js";
import { makeVerticesCoordsFolded } from "rabbit-ear/graph/vertices/folded.js";
import { FileManager } from "./FileManager.svelte";

export interface IModel {
  //set frame(frame: FOLD);
  //#graph: FOLD;
  //vertices_coordsSimulator: [number, number, number][];
  //vertices_coordsFolded: [number, number, number][];
  //faceOrders: [number, number, number][];
  fold: FOLD;
}

class CreasePatternModel implements IModel {
  #fileManager: FileManager;
  #frame: FOLD = $derived.by(() => this.#fileManager.file.graph);
  #isFoldedForm: boolean = $derived(isFoldedForm(this.#frame));

  constructor(fileManager: FileManager) {
    this.#fileManager = fileManager;
  }

  // it might be possible to "unfold" the vertices
  get fold(): FOLD {
    return this.#isFoldedForm ? {} : this.#frame;
    //return $state.snapshot(this.graph);
  }
}

class FoldedFormModel implements IModel {
  #fileManager: FileManager;
  #frame: FOLD = $derived.by(() => this.#fileManager.file.graph);
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

  constructor(fileManager: FileManager) {
    this.#fileManager = fileManager;
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
  #fileManager: FileManager;
  #frame: FOLD = $derived.by(() => this.#fileManager.file.graph);
  #vertices_coords: [number, number, number][] = $state.raw([]);

  constructor(fileManager: FileManager) {
    this.#fileManager = fileManager;
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
  models: IModel[] = $state([]);

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
    this.models = [
      new CreasePatternModel(fileManager),
      new FoldedFormModel(fileManager),
      new SimulatorModel(fileManager),
    ];
  }
}
