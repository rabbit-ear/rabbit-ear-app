import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Embedding } from "../Embedding.ts";
import type { FrameAttributes } from "../FrameAttributes.ts";
import type { GraphData } from "../GraphData.svelte.ts";
import type { FOLDSelection } from "../../general/types.ts";
import type { VertexBVHType, EdgeBVHType, FaceBVHType } from "../../general/BVHGraph.ts";
import type { GraphUpdateEvent } from "../Updated.ts";
// import type { Shape } from "../../geometry/shapes.ts";
import Panel from "./Panel.svelte";
import { resize2 } from "rabbit-ear/math/vector.js";
import { VertexBVH, EdgeBVH, FaceBVH } from "../../general/BVHGraph.ts";
import { makeGraphUpdateEvent } from "../Updated.ts";

export class CreasePattern implements Embedding {
  name: string = "creasePattern";
  abbreviation: string = "cp";
  warnings: string[] = [];
  errors: string[] = [];
  panel: Component = Panel;
  #data: GraphData;
  #effects: (() => void)[];

  #vertexBVH = $derived.by(() => VertexBVH(this.#data.frame));
  #edgeBVH = $derived.by(() => EdgeBVH(this.#data.frame));
  #faceBVH = $derived.by(() => FaceBVH(this.#data.frame));

  selection?: FOLDSelection;

  graph: FOLD | undefined;

  graphUpdate: GraphUpdateEvent = $state(makeGraphUpdateEvent());

  sourceIsCreasePattern: boolean = $derived
    .by(() => !this.#data.frameAttributes.isFoldedForm);

  isEditable: boolean = $derived
    .by(() => !this.#data.frameAttributes.isFoldedForm);

  setGraph(newGraph: FOLD | undefined) {
    this.graph = newGraph;
    this.graphUpdate.reset++;
  }

  get snapPoints(): [number, number][] {
    return this.graph?.vertices_coords?.map(resize2) ?? [];
  }

  get attributes(): FrameAttributes {
    return {
      ...this.#data.frameAttributes,
      isFoldedForm: false,
      // // unclear what we should say here. a CP does not render layer orders
      // // (not the folded form of a CP, but the CP itself)
      // hasLayerOrder: true,
    };
  }

  // get shapes(): Shape[] {
  //   return this.#model.shapes;
  // }

  constructor(data: GraphData) {
    this.#data = data;
    this.setGraph(this.#data.frameAttributes?.isFoldedForm
      ? undefined
      : this.#data.frame);
    this.#effects = [
      this.#effectGraphUpdate(),
    ];
  }

  dealloc() {
    this.#effects.forEach(fn => fn());
  }

  nearestVertex(point: [number, number]): VertexBVHType {
    return this.#vertexBVH?.nearest(point);
  }

  nearestEdge(point: [number, number]): EdgeBVHType {
    return this.#edgeBVH?.nearest(point);
  }

  nearestFace(point: [number, number]): FaceBVHType {
    return this.#faceBVH?.nearest(point);
  }

  // conditions for updating the graph: 
  // - it always updates (any changes to the source frame)
  #effectGraphUpdate(): () => void {
    return $effect.root(() => {
      $effect(() => {
        this.setGraph(this.#data.frameAttributes?.isFoldedForm
          ? undefined
          : this.#data.frame);
      });
      // empty
      return () => { };
    });
  }
}

