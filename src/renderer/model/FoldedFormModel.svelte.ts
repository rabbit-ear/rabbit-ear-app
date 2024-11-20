import type { FOLD } from "rabbit-ear/types.d.ts";
import type { IModel, Models } from "./Models.svelte.ts";
import type { Shape } from "../geometry/shapes.ts";
import { makeVerticesCoordsFolded } from "rabbit-ear/graph/vertices/folded.js";

export class FoldedFormModel implements IModel {
  name: string = "foldedForm";
  #models: Models;
  #graph: FOLD = $derived.by(() => this.#models.flatFrame);
  #isFoldedForm: boolean = $derived.by(() => this.#models.isFoldedForm);

  #vertices_coords: [number, number][] | [number, number, number][] = $derived.by(() => {
    if (this.#isFoldedForm) {
      return this.#graph?.vertices_coords || [];
    }
    try {
      return makeVerticesCoordsFolded(this.#graph);
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
      ...this.#graph,
      vertices_coords: this.#vertices_coords,
      //faceOrders: this.faceOrders,
    };
  }
}
