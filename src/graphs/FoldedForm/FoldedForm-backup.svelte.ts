import { untrack, type Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Embedding } from "../Embedding.ts";
import { FrameClass, type FrameAttributes } from "../FrameAttributes.ts";
import type { GraphData } from "../GraphData.svelte.ts";
import type { GraphUpdateEvent } from "../Updated.ts";
import type { EdgeBVHType, FaceBVHType, VertexBVHType } from "../../general/BVHGraph.ts";
// import type { Shape } from "../../geometry/shapes.ts";
import { makeGraphUpdateEvent } from "../Updated.ts";
import { FoldedVertices } from "./FoldedVertices.svelte.ts";
// import { LayerOrder } from "./LayerOrder.svelte.ts";
import { Settings } from "./Settings.svelte.ts";
import Panel from "./Panel.svelte";
import context from "../../app/context.svelte.ts";

export class FoldedForm implements Embedding {
  name: string = "foldedForm";
  abbreviation: string = "folded";
  panel: Component = Panel;

  #data: GraphData;
  folded: FoldedVertices;
  // orders: LayerOrder;
  settings: Settings;
  #effects: (() => void)[];

  graph: FOLD | undefined;

  graphUpdate: GraphUpdateEvent = $state(makeGraphUpdateEvent());

  sourceIsFoldedForm: boolean = $derived
    .by(() => this.#data.frame.attributes.class === FrameClass.foldedForm);

  // computed face orders
  hasLayerOrder: boolean = $state(false);

  faceOrders: [number, number, number][] | undefined = $state();

  faceOrdersError: Error | undefined = $state();

  // get attributes() { return this.#data.frame.attributes; }
  // attributes = $derived.by(() => this.#data.frame.attributes);
  attributes: FrameAttributes = $derived.by(() => ({
    ...this.#data.frame.attributes,
    hasLayerOrder: this.hasLayerOrder,
    // hasLayerOrder: true,
  }));

  setGraph(newGraph: FOLD | undefined) {
    untrack(() => {
      this.graph = {
        // ...$state.snapshot(newGraph),
        ...newGraph,
        vertices_coords: this.settings.foldVerticesCoords
          ? this.folded.vertices_coords
          : newGraph?.vertices_coords,
        faceOrders: this.settings.solveFaceOrders
          ? $state.snapshot(this.faceOrders) as [number, number, number][]
          : newGraph?.faceOrders,
        frame_classes: ["foldedForm"],
      };
    });
    this.hasLayerOrder = (this.graph?.faceOrders && this.graph?.faceOrders.length > 0) ?? false;
    this.graphUpdate.reset++;
    // this.graphUpdate.structural++;
  }

  // todo
  get snapPoints(): [number, number][] {
    return [];
    // return this.#model.frame.vertices_coords?.map(resize3) ?? [];
  }

  get errors(): string[] {
    return [this.folded.error, this.faceOrdersError]
      .filter(a => a !== undefined)
      .map(error => String(error));
  }

  // get shapes(): Shape[] {
  //   return this.#models.shapes;
  // }

  constructor(data: GraphData) {
    this.#data = data;
    this.folded = new FoldedVertices(this, data);
    // this.orders = new LayerOrder(this, data);
    this.settings = new Settings();
    this.#effects = [
      this.#effectGraphUpdate(),
      this.#effectFoldedVertices(),
      this.#effectFaceOrdersUpdate(),
    ];
    context.workerManager.faceOrders.onmessage = (ev) => this.onFaceOrdersMessage(ev);
    context.workerManager.faceOrders.onerror = (ev) => this.onFaceOrdersError(ev);
    this.setGraph(this.#data.frame.baked);
  }

  dealloc(): void {
    this.#effects.forEach(fn => fn());
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

  onFaceOrdersMessage({ data }: MessageEvent) {
    console.log("LayerOrder responded with a message", data);
    this.faceOrdersError = undefined;
    this.faceOrders = data.result;
  }

  onFaceOrdersError(error: ErrorEvent) {
    console.log("LayerOrder responded with an error", error);
    this.faceOrders = undefined;
    this.faceOrdersError = error.error;
  }

  // conditions for updating the graph: 
  // - it always updates (any changes to the source frame)
  #effectGraphUpdate(): () => void {
    return $effect.root(() => {
      $effect(() => {
        console.log("$effect settings did change");
        const _ = this.faceOrders;
        const __ = this.settings.solveFaceOrders;
        const ___ = this.settings.foldVerticesCoords;
        this.setGraph(this.#data.frame.baked);
      });
      return () => { };
    });
  }

  #effectFoldedVertices(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (!this.settings.solveFaceOrders) { return; }
        console.log("$effect face orders posting message to worker...");
        const graph = {
          ...this.#data.frame.baked,
          vertices_coords: this.folded.vertices_coords,
        };
        context.workerManager.faceOrders.postMessage({ graph });
      });
      return () => { };
    });
  }

  #effectFaceOrdersUpdate(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (!this.graph) { return; }
        console.log("$effect setting faceOrders");
        this.graph.faceOrders = this.settings.solveFaceOrders
          ? $state.snapshot(this.faceOrders) as [number, number, number][]
          : this.graph?.faceOrders;
      });
      return () => { };
    });
  }
}

