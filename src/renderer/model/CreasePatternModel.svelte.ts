import type { FOLD } from "rabbit-ear/types.d.ts";
import type { IModel, Models } from "./Models.svelte.ts";
import type { Shape } from "../geometry/shapes.ts";
import { isFoldedForm } from "rabbit-ear/fold/spec.js";

export class CreasePatternModel implements IModel {
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
