import { isFoldedForm } from "rabbit-ear/fold/spec.js";
import type { FOLD } from "rabbit-ear/types.d.ts";

interface IModel {
  graph: FOLD;
  //vertices_coordsSimulator: [number, number, number][];
  //vertices_coordsFolded: [number, number, number][];
  //faceOrders: [number, number, number][];
  fold: FOLD;
}

class CreasePatternModel implements IModel {
  graph: FOLD = $state.raw({});
  isFoldedForm: boolean = $derived(isFoldedForm(this.graph));

  constructor(graph: FOLD) {
    this.graph = graph;
  }

  // it might be possible to "unfold" the vertices
  get fold(): FOLD {
    return isFoldedForm ? {} : this.graph;
    //return $state.snapshot(this.graph);
  }
}

class FoldedFormModel implements IModel {
  graph: FOLD = $state.raw({});
  vertices_coords: [number, number, number][] = $state.raw([]);
  faceOrders: [number, number, number][] = $state.raw([]);

  constructor(graph: FOLD) {
    this.graph = graph;
  }

  get fold(): FOLD {
    return {
      //...$state.snapshot(this.graph),
      ...this.graph,
      vertices_coords: this.vertices_coords,
      faceOrders: this.faceOrders,
    };
  }
}

class SimulatorModel implements IModel {
  graph: FOLD = $state.raw({});
  vertices_coords: [number, number, number][] = $state.raw([]);

  constructor(graph: FOLD) {
    this.graph = graph;
  }

  get fold(): FOLD {
    return {
      //...$state.snapshot(this.graph),
      ...this.graph,
      vertices_coords: this.vertices_coords,
    };
  }
}

export class Models {
  #frame: FOLD = $state.raw({});

  set frame(frame: FOLD) {
    this.#frame = frame;
    this.models.forEach((model) => {
      model.graph = this.#frame;
    });
  }

  vertices_coordsSimulator: [number, number, number][] = $derived.by(() => []);
  vertices_coordsFolded: [number, number, number][] = $derived.by(() => []);
  faceOrders: [number, number, number][] = $derived.by(() => []);

  models: IModel[] = $state([]);

  constructor() {
    const cp = new CreasePatternModel(this.frame);

    const simulator = new SimulatorModel(this.frame);
    simulator.vertices_coords = this.vertices_coordsSimulator;

    const foldedForm = new FoldedFormModel(this.frame);
    foldedForm.vertices_coords = this.vertices_coordsFolded;
    foldedForm.faceOrders = this.faceOrders;

    this.models = [cp, foldedForm, simulator];
  }
}
