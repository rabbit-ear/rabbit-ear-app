import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Embedding } from "../Embedding.ts";
import type { GraphData } from "../GraphData.svelte.ts";
import type { GraphUpdateEvent } from "../Updated.ts";
import type { FOLDSelection } from "../../general/selection.ts";
import { EmbeddingType, type GraphAttributes } from "../GraphAttributes.ts";
import { Nearest } from "../Nearest.svelte.ts";
import Panel from "./Panel.svelte";
import context from "../../app/context.svelte.ts";

export class Simulator implements Embedding {
  name: string = "simulator";
  abbreviation: string = "sim";
  errors: string[] = [];
  panel: Component = Panel;
  #data: GraphData;
  nearest: Nearest;

  // not reactive
  get graph(): FOLD | undefined { return context.simulator.graph; }

  // reactive. subscribe to this to watch the graph
  embeddingUpdate: GraphUpdateEvent = $derived.by(() => context.simulator.graphUpdate);
  // get embeddingUpdate(): GraphUpdateEvent { return context.simulator.graphUpdate; }

  // get attributes() { return this.#data.frame.attributes; }
  get attributes() {
    return {
      ...this.#data.frame.attributes,
      dimension: 3,
      hasLayerOrder: false,
      class: EmbeddingType.foldedForm,
    } as GraphAttributes;
  }

  get selection(): FOLDSelection | undefined { return this.#data.frame.selection; }

  #effects: (() => void)[] = [];

  constructor(data: GraphData) {
    this.#data = data;
    this.nearest = new Nearest(this);
    this.#effects = [];
    // this.#setSimulatorGraph();
  }

  dealloc(): void {
    this.#effects.forEach((fn) => fn());
  }

  nearestSnapPoint(point: [number, number]): {
    coords: [number, number] | [number, number, number],
    dist: number,
  } | undefined {
    return undefined;
  }

  // // todo this needs to move. it's being called once for every open file.
  // #setSimulatorGraph(): () => void {
  //   return $effect.root(() => {
  //     $effect(() => {
  //       context.simulator.inputGraph = context.fileManager.document?.data.cp.graph;
  //       // context.simulator.inputGraph = this.#data.cp.graph;
  //     });
  //     return () => {
  //       context.simulator.inputGraph = undefined;
  //     };
  //   });
  // }
}

