import { untrack, type Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Embedding } from "../Embedding.ts";
import { FrameClass, type FrameAttributes } from "../FrameAttributes.ts";
import type { GraphData } from "../GraphData.svelte.ts";
import type { GraphUpdateEvent } from "../Updated.ts";
import type { EdgeBVHType, FaceBVHType, VertexBVHType } from "../../general/BVHGraph.ts";
// import type { Shape } from "../../geometry/shapes.ts";
import { makeGraphUpdateEvent } from "../Updated.ts";
import { Folded } from "./Folded.svelte.ts";
import { LayerOrder } from "./LayerOrder.svelte.ts";
import { Settings } from "./Settings.svelte.ts";
import Panel from "./Panel.svelte";

export class FoldedForm implements Embedding {
  name: string = "foldedForm";
  abbreviation: string = "folded";
  panel: Component = Panel;

  #data: GraphData;
  folded: Folded;
  orders: LayerOrder;
  settings: Settings;
  #effects: (() => void)[];

  graph: FOLD | undefined;

  graphUpdate: GraphUpdateEvent = $state(makeGraphUpdateEvent());

  sourceIsFoldedForm: boolean = $derived
    .by(() => this.#data.frame.attributes.class === FrameClass.foldedForm);

  // computed face orders
  hasLayerOrder: boolean = $state(false);

  // get attributes() { return this.#data.frame.attributes; }
  // attributes = $derived.by(() => this.#data.frame.attributes);
  attributes: FrameAttributes = $derived.by(() => {
    return !this.hasLayerOrder
      ? this.#data.frame.attributes
      : {
        ...this.#data.frame.attributes,
        hasLayerOrder: this.hasLayerOrder,
      };
  });

  setGraph(newGraph: FOLD | undefined) {
    untrack(() => {
      this.graph = {
        // ...$state.snapshot(newGraph),
        ...newGraph,
        vertices_coords: this.folded.vertices_coords,
        faceOrders: this.orders.faceOrders,
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
    return [this.folded.error, this.orders.error]
      .filter(a => a !== undefined)
      .map(error => String(error));
  }

  // get shapes(): Shape[] {
  //   return this.#models.shapes;
  // }

  constructor(data: GraphData) {
    this.#data = data;
    this.folded = new Folded(this.#data);
    this.orders = new LayerOrder(this.#data, this.folded);
    this.settings = new Settings();
    this.#effects = [
      this.#effectGraphUpdate(),
    ];
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

  // conditions for updating the graph: 
  // - it always updates (any changes to the source frame)
  #effectGraphUpdate(): () => void {
    return $effect.root(() => {
      $effect(() => this.setGraph(this.#data.frame.baked));
      return () => { };
    });
  }
}

