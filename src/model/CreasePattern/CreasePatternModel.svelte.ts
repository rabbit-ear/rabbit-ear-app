import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Model } from "../Model.ts";
import type { FrameStyle } from "../FrameStyle.ts";
// import type { Shape } from "../../geometry/shapes.ts";
import Panel from "./Panel.svelte";
import { resize2 } from "rabbit-ear/math/vector.js";
import type { FileModel } from "../../app/FileModel.svelte.ts";

export class CreasePatternModel implements Model {
  name: string = "creasePattern";
  abbreviation: string = "cp";
  errors: string[] = [];
  panel: Component = Panel;

  #model: FileModel;
  #graph: FOLD = $derived.by(() => this.#model.frameFlat);
  #isFoldedForm: boolean = $derived.by(() => this.#model.frameStyle?.isFoldedForm);

  //snapPoints: [number, number][] = $state([]);
  snapPoints: [number, number][] = $derived.by(() =>
    this.#graph?.vertices_coords?.map(resize2),
  );

  constructor(model: FileModel) {
    this.#model = model;
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

  // get shapes(): Shape[] {
  //   return this.#model.shapes;
  // }

  // it might be possible to "unfold" the vertices
  get graph(): FOLD {
    console.log("requesting cp.graph", this.#graph);
    //return this.#isFoldedForm ? {} : this.#graph;
    return this.#isFoldedForm ? {} : ($state.snapshot(this.#graph) as FOLD);
    //return $state.snapshot(this.graph);
  }
}
