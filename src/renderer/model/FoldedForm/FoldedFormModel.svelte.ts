import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { IModel } from "../Model.svelte.ts";
import type { Models } from "../Models.svelte.ts";
import type { FrameStyle } from "../../file/FrameStyle.ts";
import type { Shape } from "../../geometry/shapes.ts";
import { makeVerticesCoordsFolded } from "rabbit-ear/graph/vertices/folded.js";
import { getDimensionQuick } from "rabbit-ear/fold/spec.js";
import { Settings } from "./Settings.svelte.ts";
import Panel from "./Panel.svelte";

export class FoldedFormModel implements IModel {
  name: string = "foldedForm";
  abbreviation: string = "folded";
  panel: Component = Panel;

  #models: Models;
  #graph: FOLD = $derived.by(() => this.#models.frameFlat);
  #isFoldedForm: boolean = $derived.by(() => this.#models.frameStyle?.isFoldedForm);
  settings: Settings;

  #verticesFoldedResult: {
    error: Error;
    result: [number, number][] | [number, number, number][];
  } = $derived.by(() => {
    if (this.#isFoldedForm) {
      return { error: undefined, result: this.#graph?.vertices_coords || [] };
    }
    if (!this.settings.active) {
      return { error: new Error("automatic folding currently off"), result: undefined };
    }
    try {
      return { error: undefined, result: makeVerticesCoordsFolded(this.#graph) };
    } catch (error) {
      return { error, result: [] };
    }
  });

  #vertices_coords: [number, number][] | [number, number, number][] = $derived(
    this.#verticesFoldedResult.result,
  );

  // todo
  snapPoints: [number, number][] | [number, number, number][] = $state([]);

  //#verticesFoldedErrors: string[] = $derived(
  //  this.#verticesFoldedResult.error ? [`${this.#verticesFoldedResult.error}`] : [],
  //);
  #verticesFoldedErrors: string[] = $derived(["error folding vertices_coords"]);
  //#layerOrderErrors: string[] = $state([]);
  errors: string[] = $derived(this.#verticesFoldedErrors);

  constructor(models: Models) {
    this.#models = models;
    this.settings = new Settings();
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
