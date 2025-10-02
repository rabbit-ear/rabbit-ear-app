import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Embedding } from "../Embedding.ts";
import type { GraphData } from "../GraphData.svelte.ts";
import type { FOLDSelection } from "../../general/selection.ts";
import { makeGraphUpdateEvent, type GraphUpdateEvent } from "../Updated.ts";
import { EmbeddingType, type GraphAttributes } from "../GraphAttributes.ts";
import { Nearest } from "../Nearest.svelte.ts";
import Panel from "./Panel.svelte";
// import type { Shape } from "../../geometry/shapes.ts";
import { resize2 } from "rabbit-ear/math/vector.js";
import { getDimensionQuick } from "rabbit-ear/fold/spec.js";

export class CreasePattern implements Embedding {
  name: string = "creasePattern";
  abbreviation: string = "cp";
  warnings: string[] = [];
  errors: string[] = [];
  panel: Component = Panel;
  nearest: Nearest;
  #data: GraphData;
  #effects: (() => void)[];

  graph: FOLD | undefined;
  #vertices_coords: [number, number][] | undefined = [];

  // this is the internal update
  #update: GraphUpdateEvent = $state(makeGraphUpdateEvent());

  // this is the reactive state to watch to determine when this embedding's graph
  // has updated. the formula for each entry is this = #data.graphUpdate + #update
  embeddingUpdate: GraphUpdateEvent = $state(makeGraphUpdateEvent());

  frameLinked = $derived.by(() => this.#data.frame.attributes.isParent
    || this.#data.frame.attributes.isChild);

  attributes: GraphAttributes = $derived.by(() => ({
    ...this.#data.frame.attributes,
    dimension: 2,
    class: EmbeddingType.creasePattern,
  }) as GraphAttributes);

  get selection(): FOLDSelection | undefined { return this.#data.frame.selection; }

  get snapPoints(): [number, number][] {
    return (this.graph?.vertices_coords as [number, number][]) ?? [];
  }

  // get shapes(): Shape[] {
  //   return this.#model.shapes;
  // }

  // todo: this should not be here. this is tool-dependent.
  // editable: boolean = $derived.by(() => !this.frameLinked
  //   && this.#data.frame.attributes.class === EmbeddingType.creasePattern);
  // userLocked: boolean | undefined = $state(undefined);
  // sourceIsCreasePattern: boolean = $derived.by(() => this.#data.frameAttributes.isCreasePattern);
  // attributeLocked: boolean = $derived.by(() => !this.#data.frameAttributes.isCreasePattern);
  // locked: boolean = $derived(this.userLocked !== undefined
  //   ? this.userLocked
  //   : this.attributeLocked);

  constructor(data: GraphData) {
    this.#data = data;
    this.nearest = new Nearest(this);
    this.#effects = [
      this.#effectNewGraphReset(),
      this.#effectNewGraphStructural(),
      this.#effectNewGraphIsomorphic(),
      this.#effectGraphUpdate(),
    ];
  }

  dealloc() {
    this.#effects.forEach(fn => fn());
  }

  nearestSnapPoint(point: [number, number]): {
    coords: [number, number] | [number, number, number],
    dist: number,
  } | undefined {
    const vertex = this.nearest.vertex(point);
    if (!vertex) { return undefined; }
    return {
      coords: vertex.coords,
      dist: vertex.dist,
    };
  }

  // assemble all constituent parts of this crease pattern graph into
  // the top level graph
  #assembleGraph(): FOLD | undefined {
    // todo: it might be possible to "unfold" the vertices
    if (this.#data.frame.attributes.class === EmbeddingType.foldedForm) { return undefined; }
    if (!this.#data.frame.graph) { return undefined; }
    return {
      ...this.#data.frame.graph,
      frame_classes: ["creasePattern"],
      vertices_coords: this.#vertices_coords ?? [],
    };
  }

  // return the vertices coords of a graph but ensure they are 2D
  #getVerticesCoords2D(graph: FOLD): [number, number][] | undefined {
    try {
      switch (getDimensionQuick(graph)) {
        case 2: return graph.vertices_coords as [number, number][];
        case 3: return (graph.vertices_coords ?? []).map(resize2);
        case undefined:
        default:
          return undefined;
      }
    } catch {
      return undefined;
    }
  }

  // fires on source GraphData's update.reset
  #effectNewGraphReset(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = this.#data.graphUpdate.reset;
        this.#vertices_coords = this.#getVerticesCoords2D(this.#data.frame.graph);
        this.graph = this.#assembleGraph();
        this.#update.reset++;
        console.log("CreasePattern() graph: reset");
      });
      // empty
      return () => { };
    });
  }

  // fires on source GraphData's update.structural
  #effectNewGraphStructural(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = this.#data.graphUpdate.structural;
        this.#vertices_coords = this.#getVerticesCoords2D(this.#data.frame.graph);
        this.graph = this.#assembleGraph();
        this.#update.structural++;
        console.log("CreasePattern() graph: structural");
      });
      // empty
      return () => { };
    });
  }

  // fires on source GraphData's update.isomorphic.coords
  #effectNewGraphIsomorphic(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = this.#data.graphUpdate.isomorphic.coords;
        this.#vertices_coords = this.#getVerticesCoords2D(this.#data.frame.graph);
        this.graph = this.#assembleGraph();
        this.#update.isomorphic.coords++;
        console.log("CreasePattern() graph: isomorphic coords");
      });
      // empty
      return () => { };
    });
  }

  #effectGraphUpdate(): () => void {
    return $effect.root(() => {
      $effect(() => {
        this.embeddingUpdate.isomorphic.coords = this.#data.graphUpdate.isomorphic.coords
          + this.#update.isomorphic.coords;
      });
      $effect(() => {
        this.embeddingUpdate.isomorphic.assignments = this.#data.graphUpdate.isomorphic.assignments
          + this.#update.isomorphic.assignments;
      });
      $effect(() => {
        this.embeddingUpdate.isomorphic.foldAngles = this.#data.graphUpdate.isomorphic.foldAngles
          + this.#update.isomorphic.foldAngles;
      });
      $effect(() => {
        this.embeddingUpdate.isomorphic.faceOrders = this.#data.graphUpdate.isomorphic.faceOrders
          + this.#update.isomorphic.faceOrders;
      });
      $effect(() => { this.embeddingUpdate.reset = this.#data.graphUpdate.reset + this.#update.reset; });
      $effect(() => { this.embeddingUpdate.structural = this.#data.graphUpdate.structural + this.#update.structural; });
      $effect(() => { this.embeddingUpdate.selection = this.#data.graphUpdate.selection + this.#update.selection; });

      return () => { };
    });
  }
}

