import type { GraphData } from "../GraphData.svelte";
import type { FoldedForm } from "./FoldedForm.svelte";
import { layer3D } from "rabbit-ear/layer/layer.js";

export class LayerOrder {
  #foldedForm: FoldedForm
  #data: GraphData;

  faceOrdersAndError: {
    error: Error | undefined;
    result: [number, number, number][] | undefined;
  } = $derived.by(() => {
    try {
      if (this.#data.frame.attributes.hasLayerOrder) {
        return { error: undefined, result: this.#data.frame.baked.faceOrders };
      }
      const graph = {
        ...this.#data.frame.baked,
        vertices_coords: this.#foldedForm.folded.vertices_coords,
      };
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

  constructor(foldedForm: FoldedForm, data: GraphData) {
    this.#foldedForm = foldedForm;
    this.#data = data;
  }
}

