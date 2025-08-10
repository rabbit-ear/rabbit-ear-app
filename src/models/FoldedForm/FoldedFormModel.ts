import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Model } from "../Model.ts";
import type { FrameAttributes } from "../FrameAttributes.ts";
import type { FileModel } from "../FileModel.svelte.ts";
// import type { Shape } from "../../geometry/shapes.ts";
import { makeVerticesCoordsFolded } from "rabbit-ear/graph/vertices/folded.js";
import { getDimensionQuick } from "rabbit-ear/fold/spec.js";
import { Settings } from "./Settings.svelte.ts";
import Panel from "./Panel.svelte";

export class FoldedFormModel implements Model {
  name: string = "foldedForm";
  abbreviation: string = "folded";
  panel: Component = Panel;

  #model: FileModel;
  settings: Settings;

  get foldedVerticesResultAndErrors(): {
    error: Error | undefined;
    result: [number, number][] | [number, number, number][];
  } {
    if (this.#model.frameProperties?.isFoldedForm) {
      return { error: undefined, result: this.#model.frame.vertices_coords ?? [] };
    }
    if (!this.settings.active) {
      return { error: new Error("automatic folding currently off"), result: [] };
    }
    try {
      return { error: undefined, result: makeVerticesCoordsFolded(this.#model.frame) };
    } catch (err: unknown) {
      const error = err instanceof Error
        ? err
        : new Error(String(err));
      return { error, result: [] };
    }
  }

  get vertices_coords(): [number, number][] | [number, number, number][] {
    return this.foldedVerticesResultAndErrors.result;
  };

  // todo
  get snapPoints(): [number, number][] {
    return [];
    // return this.#model.frame.vertices_coords?.map(resize3) ?? [];
  }

  //#layerOrderErrors: string[] = $state([]);

  get errors(): string[] {
    return this.foldedVerticesResultAndErrors.error
      ? [`${this.foldedVerticesResultAndErrors.error}`]
      : [];
  }

  get attributes(): FrameAttributes {
    return {
      isFoldedForm: true,
      dimension: getDimensionQuick({ vertices_coords: this.vertices_coords }) ?? 2,
      showVertices:
        (this.#model.frame.vertices_coords &&
          !this.#model.frame.edges_vertices &&
          !this.#model.frame.faces_vertices) ?? false,
      transparentFaces: this.#model.frame.faceOrders == null,
    };
  }

  // get shapes(): Shape[] {
  //   return this.#models.shapes;
  // }

  //faceOrders: [number, number, number][] = $state.raw([]);

  get graph(): FOLD | undefined {
    return {
      //...$state.snapshot(this.graph),
      ...this.#model.frame,
      vertices_coords: this.vertices_coords,
      //faceOrders: this.faceOrders,
      frame_classes: ["foldedForm"],
    };
  }

  constructor(model: FileModel) {
    this.#model = model;
    this.settings = new Settings();
  }
}
