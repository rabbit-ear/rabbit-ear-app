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
import { makeGraphUpdateEvent } from "../Updated.ts";

export class CreasePattern implements Embedding {
  name: string = "creasePattern";
  abbreviation: string = "cp";
  warnings: string[] = [];
  errors: string[] = [];
  panel: Component = Panel;
  #data: GraphData;
  #effects: (() => void)[];

  #vertexBVH = $derived.by(() => VertexBVH(this.#data.frame.baked));
  #edgeBVH = $derived.by(() => EdgeBVH(this.#data.frame.baked));
  #faceBVH = $derived.by(() => FaceBVH(this.#data.frame.baked));

  graph: FOLD | undefined;

  graphUpdate: GraphUpdateEvent = $state(makeGraphUpdateEvent());

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

  get selection(): FOLDSelection | undefined { return this.#data.selection; }

  // get selectionGraph(): FOLD | undefined { return this.#data.selectionGraph; }
  get selectionFaceGraph(): FOLD | undefined { return this.#data.selectionFaceGraph; }
  get selectionEdgeGraph(): FOLD | undefined { return this.#data.selectionEdgeGraph; }
  get selectionVertexGraph(): FOLD | undefined { return this.#data.selectionVertexGraph; }

  // userLocked: boolean | undefined = $state(undefined);
  // sourceIsCreasePattern: boolean = $derived.by(() => this.#data.frameAttributes.isCreasePattern);
  // attributeLocked: boolean = $derived.by(() => !this.#data.frameAttributes.isCreasePattern);
  // locked: boolean = $derived(this.userLocked !== undefined
  //   ? this.userLocked
  //   : this.attributeLocked);

  setGraph(newGraph: FOLD | undefined) {
    this.graph = newGraph;
    this.graphUpdate.reset++;
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
      ? this.#data.frame.baked
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
        this.setGraph(this.#data.frame.attributes.class === FrameClass.creasePattern
          ? this.#data.frame.baked
          : undefined);
      });
      // empty
      return () => { };
    });
  }
}

