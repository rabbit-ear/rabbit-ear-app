import type { FOLD } from "rabbit-ear/types.d.ts";
import type { IModel } from "./Model.svelte.ts";
import type { Models } from "./Models.svelte.ts";
import type { FrameStyle } from "../file/FrameStyle.ts";
import type { Shape } from "../geometry/shapes.ts";
import { makeVerticesCoordsFolded } from "rabbit-ear/graph/vertices/folded.js";
import { getDimensionQuick } from "rabbit-ear/fold/spec.js";

export class FoldedFormModel implements IModel {
  name: string = "foldedForm";
  abbreviation: string = "folded";
  #models: Models;
  #graph: FOLD = $derived.by(() => this.#models.frameFlat);
  #isFoldedForm: boolean = $derived.by(() => this.#models.frameStyle?.isFoldedForm);

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

  style: FrameStyle = $derived({
    isFoldedForm: true,
    dimension: getDimensionQuick({ vertices_coords: this.#vertices_coords }),
    showVertices:
      this.#graph?.vertices_coords &&
      !this.#graph?.edges_vertices &&
      !this.#graph?.faces_vertices,
    transparentFaces: this.#graph.faceOrders == null,
  });

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
      frame_classes: ["foldedForm"],
    };
  }
}
