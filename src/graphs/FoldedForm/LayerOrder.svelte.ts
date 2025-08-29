import type { GraphData } from "../GraphData.svelte";
// import { FrameClass } from "../FrameAttributes";
import { layer, layer3D } from "rabbit-ear/layer/layer.js";
import type { Folded } from "./Folded.svelte";

export class LayerOrder {
  #data: GraphData;
  #folded: Folded;

  faceOrdersAndError: {
    error: Error | undefined;
    result: [number, number, number][] | undefined;
  } = $derived.by(() => {
    try {
      if (this.#data.frame.attributes.hasLayerOrder) {
        return { error: undefined, result: this.#data.frame.baked.faceOrders ?? [] };
      }
      const graph = {
        ...this.#data.frame.baked,
        vertices_coords: this.#folded.vertices_coords,
      };
      console.log("computing face orders");
      return { error: undefined, result: layer3D(graph).faceOrders() };
    } catch (err: unknown) {
      const error = err instanceof Error
        ? err
        : new Error(String(err));
      return { error, result: undefined };
    }
  });

  faceOrders: [number, number, number][] | undefined = $derived(this.faceOrdersAndError.result);

  error: Error | undefined = $derived(this.faceOrdersAndError.error);

  constructor(data: GraphData, folded: Folded) {
    this.#data = data;
    this.#folded = folded;
  }
}

