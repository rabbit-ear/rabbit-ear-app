import type { FOLD } from "rabbit-ear/types.d.ts";
import type { IModel, Models } from "./Models.svelte.ts";
import type { Shape } from "../geometry/shapes.ts";
import app from "../app/App.svelte.ts";

export class SimulatorModel implements IModel {
  #models: Models;
  #frame: FOLD = $derived.by(() => this.#models.frame);
  #vertices_coords: [number, number, number][] = $state.raw([]);
  //#simulatorModel: Model = $derived.by(
  //  () => new Model(this.#models.frame, solverOptions),
  //);

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
