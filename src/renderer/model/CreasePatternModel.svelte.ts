import type { FOLD } from "rabbit-ear/types.d.ts";
import type { IModel, Models } from "./Models.svelte.ts";
import type { Shape } from "../geometry/shapes.ts";

export class CreasePatternModel implements IModel {
  name: string = "creasePattern";
  #models: Models;
  #graph: FOLD = $derived.by(() => this.#models.flatFrame);
  #isFoldedForm: boolean = $derived.by(() => this.#models.isFoldedForm);

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
    return this.#isFoldedForm ? {} : this.#graph;
    //return $state.snapshot(this.graph);
  }
}
