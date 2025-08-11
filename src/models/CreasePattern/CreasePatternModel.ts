import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Model } from "../Model.ts";
import type { FrameAttributes } from "../FrameAttributes.ts";
import type { FileModel } from "../FileModel.svelte.ts";
// import type { Shape } from "../../geometry/shapes.ts";
import Panel from "./Panel.svelte";
import { resize2 } from "rabbit-ear/math/vector.js";

export class CreasePatternModel implements Model {
  name: string = "creasePattern";
  abbreviation: string = "cp";
  errors: string[] = [];
  panel: Component = Panel;
  #model: FileModel;

  // it might be possible to "unfold" the vertices
  get graph(): FOLD | undefined {
    return this.#model.frameAttributes?.isFoldedForm ? undefined : this.#model.frame as FOLD;
  }

  get snapPoints(): [number, number][] {
    return this.graph?.vertices_coords?.map(resize2) ?? [];
  }

  get attributes(): FrameAttributes {
    return {
      isFoldedForm: false,
      dimension: 2,
      isAbstract:
        (this.graph?.vertices_coords &&
          !this.graph?.edges_vertices &&
          !this.graph?.faces_vertices) ?? false,
      // unclear what we should say here. a CP does not render layer orders
      // (not the folded form of a CP, but the CP itself)
      hasLayerOrder: true,
    };
  }

  // get shapes(): Shape[] {
  //   return this.#model.shapes;
  // }

  constructor(model: FileModel) {
    this.#model = model;
  }
}
