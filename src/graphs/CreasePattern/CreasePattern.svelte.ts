import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Embedding } from "../Embedding.ts";
import type { GraphData } from "../GraphData.svelte.ts";
import type { VertexBVHType, EdgeBVHType, FaceBVHType } from "../../general/BVHGraph.ts";
import type { GraphUpdateEvent } from "../Updated.ts";
import type { FOLDSelection } from "../../general/selection.ts";
import { FrameClass, type FrameAttributes } from "../FrameAttributes.ts";
// import type { Shape } from "../../geometry/shapes.ts";
import Panel from "./Panel.svelte";
import { VertexBVH, EdgeBVH, FaceBVH } from "../../general/BVHGraph.ts";
import { resize2 } from "rabbit-ear/math/vector.js";
import { validate } from "rabbit-ear/graph/validate/validate.js";

export class CreasePattern implements Embedding {
  name: string = "creasePattern";
  abbreviation: string = "cp";
  warnings: string[] = [];
  errors: string[] = [];
  panel: Component = Panel;
  #data: GraphData;
  #effects: (() => void)[];

  graph: FOLD | undefined;

  #vertexBVH = $derived.by(() => {
    const _ = [
      this.#data.graphUpdate.reset,
      this.#data.graphUpdate.structural,
      this.#data.graphUpdate.isomorphic.coords,
    ];
    // if (validate(this.#data.frame.graph).length) { console.log("!!! BVH vertex graph not valid!"); }
    return VertexBVH(this.#data.frame.graph);
  });

  #edgeBVH = $derived.by(() => {
    const _ = [
      this.#data.graphUpdate.reset,
      this.#data.graphUpdate.structural,
      this.#data.graphUpdate.isomorphic.coords,
    ];
    // if (validate(this.#data.frame.graph).length) { console.log("!!! BVH edge graph not valid!"); }
    return EdgeBVH(this.#data.frame.graph);
  });

  #faceBVH = $derived.by(() => {
    const _ = [
      this.#data.graphUpdate.reset,
      this.#data.graphUpdate.structural,
      this.#data.graphUpdate.isomorphic.coords,
    ];
    // if (validate(this.#data.frame.graph).length) { console.log("!!! BVH face graph not valid!"); }
    return FaceBVH(this.#data.frame.graph);
  });

  embeddingUpdate: GraphUpdateEvent = $derived.by(() => this.#data.graphUpdate);

  frameLinked = $derived.by(() => this.#data.frame.attributes.isParent
    || this.#data.frame.attributes.isChild);

  // todo: this should not be here. this is tool-dependent.
  editable: boolean = $derived.by(() => !this.frameLinked
    && this.#data.frame.attributes.class === FrameClass.creasePattern);

  // get attributes(): FrameAttributes {
  //   return {
  //     ...this.#data.frameAttributes,
  //     isFoldedForm: false,
  //     // // unclear what we should say here. a CP does not render layer orders
  //     // // (not the folded form of a CP, but the CP itself)
  //     // hasLayerOrder: true,
  //   };
  // }

  get attributes(): FrameAttributes { return this.#data.frame.attributes; }

  get selection(): FOLDSelection | undefined { return this.#data.frame.selection; }

  // userLocked: boolean | undefined = $state(undefined);
  // sourceIsCreasePattern: boolean = $derived.by(() => this.#data.frameAttributes.isCreasePattern);
  // attributeLocked: boolean = $derived.by(() => !this.#data.frameAttributes.isCreasePattern);
  // locked: boolean = $derived(this.userLocked !== undefined
  //   ? this.userLocked
  //   : this.attributeLocked);

  setGraph(newGraph: FOLD | undefined) {
    this.graph = newGraph;
    // this.graphUpdate.reset++;
    // this.#data.graphUpdate.reset++;
  }

  get snapPoints(): [number, number][] {
    return this.graph?.vertices_coords?.map(resize2) ?? [];
  }

  // get shapes(): Shape[] {
  //   return this.#model.shapes;
  // }

  constructor(data: GraphData) {
    this.#data = data;

    // todo: it might be possible to "unfold" the vertices
    this.setGraph(this.#data.frame.attributes.class === FrameClass.creasePattern
      ? this.#data.frame.graph
      : undefined);
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

  nearestSnapPoint(point: [number, number]): {
    coords: [number, number] | [number, number, number],
    dist: number,
  } | undefined {
    const vertex = this.nearestVertex(point);
    if (!vertex) { return undefined; }
    return {
      coords: vertex.coords,
      dist: vertex.dist,
    };
  }

  // conditions for updating the graph: 
  // - it always updates (any changes to the source frame)
  #effectGraphUpdate(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = this.#data.graphUpdate.reset;
        this.setGraph(this.#data.frame.attributes.class === FrameClass.creasePattern
          ? this.#data.frame.graph
          : undefined);
      });
      // empty
      return () => { };
    });
  }
}

