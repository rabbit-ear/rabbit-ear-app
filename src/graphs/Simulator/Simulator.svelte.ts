import { type Component } from "svelte";
import type { FOLD, Box } from "rabbit-ear/types.d.ts";
import type { Embedding } from "../Embedding.ts";
import type { FrameAttributes } from "../FrameAttributes.ts";
// import { boundingBox } from "rabbit-ear/graph/boundary.js";
import Panel from "./Panel.svelte";
import type { GraphData } from "../GraphData.svelte.ts";
import context from "../../app/context.svelte.ts";
import type { GraphUpdateEvent } from "../Updated.ts";

export class Simulator implements Embedding {
  name: string = "simulator";
  abbreviation: string = "sim";
  errors: string[] = [];
  panel: Component = Panel;
  #data: GraphData;

  // modelSize: number = $derived.by(() => {
  //   const box: Box | undefined = boundingBox(this.#data.frame);
  //   return box ? Math.max(...(box.span ?? [])) : 1;
  // });

  // for reactive updates to "graph", subscribe to this object instead
  // updated: UpdateInfo = $state({});

  get graph(): FOLD | undefined { return context.simulator.graph; }

  get graphUpdate(): GraphUpdateEvent { return context.simulator.graphUpdate; }

  #effects: (() => void)[] = [];

  //should this be $derived({
  attributes: FrameAttributes = {
    isFoldedForm: true,
    dimension: 3,
    isAbstract: false,
    hasLayerOrder: true, // todo this is weird
  };

  constructor(data: GraphData) {
    this.#data = data;
    this.#effects = [];
    this.#setSimulatorGraph();
  }

  dealloc(): void {
    this.#effects.forEach((fn) => fn());
  }

  // todo this needs to move. it's being called once for every open file.
  #setSimulatorGraph(): () => void {
    return $effect.root(() => {
      $effect(() => {
        context.simulator.inputGraph = context.fileManager.document?.data.cp.graph;
        // context.simulator.inputGraph = this.#data.cp.graph;
      });
      return () => {
        context.simulator.inputGraph = undefined;
      };
    });
  }
}
