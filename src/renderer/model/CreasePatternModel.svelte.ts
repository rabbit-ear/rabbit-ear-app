import type { FOLD } from "rabbit-ear/types.d.ts";
import type { IModel } from "./Model.svelte.ts";
import type { Models } from "./Models.svelte.ts";
import type { FrameStyle } from "../file/FrameStyle.ts";
import type { Shape } from "../geometry/shapes.ts";

export class CreasePatternModel implements IModel {
  name: string = "creasePattern";
  #models: Models;
  #graph: FOLD = $derived.by(() => this.#models.frameFlat);
  #isFoldedForm: boolean = $derived.by(() => this.#models.frameStyle?.isFoldedForm);

  // todo
  snapPoints: [number, number][] = $state([]);

  constructor(models: Models) {
    this.#models = models;
  }

  style: FrameStyle = $derived({
    isFoldedForm: false,
    dimension: 2,
    showVertices:
      this.#graph.vertices_coords &&
      !this.#graph?.edges_vertices &&
      !this.#graph?.faces_vertices,
    transparentFaces: false,
  });

  get shapes(): Shape[] {
    return this.#models.shapes;
  }

  // it might be possible to "unfold" the vertices
  get fold(): FOLD {
    return this.#isFoldedForm ? {} : this.#graph;
    //return $state.snapshot(this.graph);
  }
}
