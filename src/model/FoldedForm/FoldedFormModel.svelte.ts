import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Model } from "../Model.ts";
import type { FrameStyle } from "../FrameStyle.ts";
// import type { Shape } from "../../geometry/shapes.ts";
import { makeVerticesCoordsFolded } from "rabbit-ear/graph/vertices/folded.js";
import { getDimensionQuick } from "rabbit-ear/fold/spec.js";
import { Settings } from "./Settings.svelte.ts";
import Panel from "./Panel.svelte";
import type { FileModel } from "../../app/FileModel.svelte.ts";

export class FoldedFormModel implements Model {
  name: string = "foldedForm";
  abbreviation: string = "folded";
  panel: Component = Panel;

  #model: FileModel;
  #graph: FOLD = $derived.by(() => this.#model.frameFlat);
  #isFoldedForm: boolean = $derived.by(() => this.#model.frameStyle?.isFoldedForm);
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

  #verticesFoldedErrors: string[] = $derived(
    this.#verticesFoldedResult.error ? [`${this.#verticesFoldedResult.error}`] : [],
  );
  //#layerOrderErrors: string[] = $state([]);
  errors: string[] = $derived(this.#verticesFoldedErrors);

  constructor(model: FileModel) {
    this.#model = model;
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

  // get shapes(): Shape[] {
  //   return this.#models.shapes;
  // }

  //faceOrders: [number, number, number][] = $state.raw([]);

  get graph(): FOLD {
    return {
      //...$state.snapshot(this.graph),
      ...this.#graph,
      vertices_coords: this.#vertices_coords,
      //faceOrders: this.faceOrders,
      frame_classes: ["foldedForm"],
    };
  }
}
