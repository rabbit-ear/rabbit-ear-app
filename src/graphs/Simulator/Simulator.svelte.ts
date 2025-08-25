import { type Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Embedding } from "../Embedding.ts";
import type { FrameAttributes } from "../FrameAttributes.ts";
import Panel from "./Panel.svelte";
import type { GraphData } from "../GraphData.svelte.ts";
import context from "../../app/context.svelte.ts";
import type { GraphUpdateEvent } from "../Updated.ts";
import type { EdgeBVHType, FaceBVHType, VertexBVHType } from "../../general/BVHGraph.ts";

export class Simulator implements Embedding {
  name: string = "simulator";
  abbreviation: string = "sim";
  errors: string[] = [];
  panel: Component = Panel;
  #data: GraphData;

  // not reactive
  get graph(): FOLD | undefined { return context.simulator.graph; }

  // reactive. subscribe to this to watch the graph
  get graphUpdate(): GraphUpdateEvent { return context.simulator.graphUpdate; }

  attributes: FrameAttributes = {
    isFoldedForm: true,
    dimension: 3,
    isAbstract: false,
    hasLayerOrder: true, // todo this is weird
  };

  #effects: (() => void)[] = [];

  constructor(data: GraphData) {
    this.#data = data;
    this.#effects = [];
    // this.#setSimulatorGraph();
  }

  dealloc(): void {
    this.#effects.forEach((fn) => fn());
  }

  nearestVertex(point: [number, number]): VertexBVHType {
    return { index: 0, coords: [0, 0], dist: 0 };
  }

  nearestEdge(point: [number, number]): EdgeBVHType {
    return { index: 0, coords: [[0, 0], [0, 0]], dist: 0 };
  }

  nearestFace(point: [number, number]): FaceBVHType {
    return { index: 0, poly: [[0, 0], [0, 0], [0, 0]], dist: 0 };
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
