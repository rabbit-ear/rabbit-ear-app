import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Model } from "../Model.ts";
import type { FrameStyle } from "../FrameStyle.ts";
import type { FileModel } from "../../app/FileModel.svelte.ts";
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
  get graph(): FOLD {
    return this.#model.frameStyle?.isFoldedForm ? {} : this.#model.frame as FOLD;
  }

  get snapPoints(): [number, number][] {
    return this.graph.vertices_coords?.map(resize2) ?? [];
  }

  get style(): FrameStyle {
    return {
      isFoldedForm: false,
      dimension: 2,
      showVertices:
        (this.graph.vertices_coords &&
          !this.graph.edges_vertices &&
          !this.graph.faces_vertices) ?? false,
      transparentFaces: false,
    };
  }

  // get shapes(): Shape[] {
  //   return this.#model.shapes;
  // }

  constructor(model: FileModel) {
    this.#model = model;
  }
}
