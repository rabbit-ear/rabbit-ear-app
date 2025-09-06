import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Embedding } from "../Embedding.ts";
import type { FrameAttributes } from "../FrameAttributes.ts";
import type { GraphData } from "../GraphData.svelte.ts";
import type { GraphUpdateEvent } from "../Updated.ts";
import type { EdgeBVHType, FaceBVHType, VertexBVHType } from "../../general/BVHGraph.ts";
import type { FOLDSelection } from "../../general/selection.ts";
// import type { Shape } from "../../geometry/shapes.ts";
import { getDimensionQuick } from "rabbit-ear/fold/spec.js";
import { makeGraphUpdateEvent } from "../Updated.ts";
import { FoldedVertices } from "./FoldedVertices.svelte.ts";
import { Settings } from "./Settings.svelte.ts";
import Panel from "./Panel.svelte";

export class FoldedForm implements Embedding {
  name: string = "foldedForm";
  abbreviation: string = "folded";
  panel: Component = Panel;

  #data: GraphData;
  folded: FoldedVertices;
  settings: Settings;
  #effects: (() => void)[];

  graph: FOLD | undefined;

  graphUpdate: GraphUpdateEvent = $state(makeGraphUpdateEvent());

  faceOrdersResult: { uuid: string, result: [number, number, number][] } | undefined = $state();

  faceOrdersError: { uuid: string, error: Error } | undefined = $state();

  #attributeDimension: number = $state(3);
  #attributeHasLayerOrder: boolean = $state(false);

  // get attributes() { return this.#data.frame.attributes; }
  // attributes = $derived.by(() => this.#data.frame.attributes);
  attributes: FrameAttributes = $derived.by(() => ({
    ...this.#data.frame.attributes,
    hasLayerOrder: this.#attributeHasLayerOrder,
    dimension: this.#attributeDimension,
    // hasLayerOrder: true,
  }));

  get selection(): FOLDSelection | undefined { return this.#data.selection; }

  get selectionGraph(): FOLD | undefined { return this.#data.selectionGraph; }

  faceOrdersWorker: Worker;

  // todo
  get snapPoints(): [number, number][] {
    return [];
    // return this.#model.frame.vertices_coords?.map(resize3) ?? [];
  }

  get errors(): string[] {
    return [this.folded.error, this.faceOrdersError?.error]
      .filter(a => a !== undefined)
      .map(error => String(error));
  }

  constructor(data: GraphData) {
    this.#data = data;
    this.folded = new FoldedVertices(this, data);
    this.settings = new Settings();
    this.#effects = [
      this.#effectSetGraph(),
      this.#effectFoldedVertices(),
    ];
    // console.log("FoldedForm: constructor()", context.workerManager.faceOrders);
    this.faceOrdersWorker = new Worker(
      new URL("../../workers/dispatch.worker.js", import.meta.url),
      { type: "module", name: "layer-solver-manager" },
    );
    this.faceOrdersWorker.addEventListener("message", this.onFaceOrdersMessage.bind(this));
    this.faceOrdersWorker.addEventListener("error", this.onFaceOrdersError.bind(this));
  }

  dealloc(): void {
    this.#effects.forEach(fn => fn());
    this.faceOrdersWorker.removeEventListener("message", this.onFaceOrdersMessage);
    this.faceOrdersWorker.removeEventListener("error", this.onFaceOrdersError);
    // console.log("FoldedForm: dealloc()", context.workerManager.faceOrders);
  }

  onFaceOrdersMessage({ data }: MessageEvent) {
    // console.log("LayerOrder worker responded with a message", data.result);
    this.faceOrdersError = undefined;
    this.faceOrdersResult = { uuid: data.uuid, result: data.result };
  }

  onFaceOrdersError(error: ErrorEvent) {
    console.log("LayerOrder worker responded with an error", error);
    this.faceOrdersResult = undefined;
    // this.faceOrdersError = { uuid: error.uuid, error: error.error };
    this.faceOrdersError = { uuid: "", error: error.error };
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

  nearestSnapPoint(point: [number, number]): {
    coords: [number, number] | [number, number, number],
    dist: number,
  } | undefined {
    return undefined;
  }

  // conditions for updating the graph: 
  // - it always updates (any changes to the source frame)
  #effectSetGraph(): () => void {
    return $effect.root(() => {
      $effect(() => {
        // console.log("$effect: set graph");
        const newGraph = { ...this.#data.frame.baked };
        newGraph.frame_classes = ["foldedForm"];
        if (this.settings.foldVerticesCoords && this.folded.vertices_coords !== undefined) {
          newGraph.vertices_coords = this.folded.vertices_coords;
        }
        if (this.faceOrdersResult && this.faceOrdersResult.uuid === this.#data.frame.uuid) {
          newGraph.faceOrders = $state
            .snapshot(this.faceOrdersResult.result) as [number, number, number][];
        }
        this.graph = newGraph;
        this.#attributeDimension = getDimensionQuick(newGraph) ?? 3;
        this.#attributeHasLayerOrder = newGraph.faceOrders != null && newGraph.faceOrders.length > 0;
        this.attributes.hasLayerOrder = this.#attributeHasLayerOrder;
        this.graphUpdate.reset++;
      });
      return () => { };
    });
  }

  #effectFoldedVertices(): () => void {
    return $effect.root(() => {
      $effect(() => {
        // console.log("$effect: posting message to worker...", this.settings.solveFaceOrders);
        if (!this.settings.solveFaceOrders) {
          this.faceOrdersResult = undefined;
          return;
        }
        if (this.folded.vertices_coords === undefined) { return; }
        if (!this.settings.foldVerticesCoords) { return; }
        const graph = this.graph;
        const uuid = this.#data.frame.uuid;
        this.faceOrdersWorker.postMessage({ uuid, graph });
      });
      return () => { };
    });
  }
}

