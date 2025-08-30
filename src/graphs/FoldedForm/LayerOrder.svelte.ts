import type { GraphData } from "../GraphData.svelte";
import type { FoldedForm } from "./FoldedForm.svelte";
import context from "../../app/context.svelte.ts";
import type { FOLD } from "rabbit-ear/types.js";

// const makeHash = () =>
//   (Math.random() + 1).toString(36).substring(7) +
//   (Math.random() + 1).toString(36).substring(7);

export class LayerOrder {
  #foldedForm: FoldedForm
  #data: GraphData;

  faceOrders: [number, number, number][] | undefined = $state();

  error: Error | undefined = $state();

  // #effects: (() => void)[] = [];

  constructor(foldedForm: FoldedForm, data: GraphData) {
    this.#foldedForm = foldedForm;
    this.#data = data;
    // this.#effects = [this.#effectFaceOrders()];
    context.workerManager.faceOrders.onmessage = (ev) => this.onMessage(ev);
    context.workerManager.faceOrders.onerror = (ev) => this.onError(ev);
  }

  onError(error: ErrorEvent) {
    console.log("LayerOrder responded with an error", error);
    this.faceOrders = undefined;
    this.error = error.error;
  }

  onMessage({ data }: MessageEvent) {
    console.log("LayerOrder responded with a message", data);
    this.error = undefined;
    this.faceOrders = data.result;
  }

  solve(graph: FOLD) {
    context.workerManager.faceOrders.postMessage({ graph });
  }

  // #effectFaceOrders(): () => void {
  //   return $effect.root(() => {
  //     $effect(() => {
  //       // if (this.#data.frame.attributes.hasLayerOrder) {
  //       //   this.error = undefined;
  //       //   this.faceOrders = this.#data.frame.baked.faceOrders;
  //       // }
  //       const graph = {
  //         ...this.#data.frame.baked,
  //         vertices_coords: this.#foldedForm.folded.vertices_coords,
  //       };
  //       console.log("posting a message to the worker", graph.vertices_coords?.length);
  //       context.workerManager.faceOrders.postMessage({ graph });
  //     });
  //     return () => { };
  //   });
  // }
}

