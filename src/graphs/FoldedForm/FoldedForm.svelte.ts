import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Embedding } from "../Embedding.ts";
import { EmbeddingType, type GraphAttributes } from "../GraphAttributes.ts";
import type { GraphData } from "../GraphData.svelte.ts";
import type { GraphUpdateEvent } from "../Updated.ts";
import type { FOLDSelection } from "../../general/selection.ts";
import { getDimensionQuick } from "rabbit-ear/fold/spec.js";
import { makeGraphUpdateEvent } from "../Updated.ts";
import { makeVerticesCoordsFolded } from "rabbit-ear/graph/vertices/folded.js";
import { Settings } from "./Settings.svelte.ts";
import { Nearest } from "../Nearest.svelte.ts";
import Panel from "./Panel.svelte";

export class FoldedForm implements Embedding {
  name: string = "foldedForm";
  abbreviation: string = "folded";
  panel: Component = Panel;
  settings: Settings;
  nearest: Nearest;
  faceOrdersWorker: Worker;
  #data: GraphData;
  #effects: (() => void)[];

  graph: FOLD | undefined;
  #vertices_coords: [number, number][] | [number, number, number][] | undefined = $state.raw();
  #faceOrders: [number, number, number][] | undefined;

  #foldedVerticesError: Error | undefined = $state();
  #faceOrdersResult: { uuid: string, result: [number, number, number][] } | undefined = $state.raw();
  #faceOrdersError: { uuid: string, error: Error } | undefined = $state();

  #attributeDimension: number = $state(3);
  #attributeHasLayerOrder: boolean = $state(false);

  // this is the internal update
  #update: GraphUpdateEvent = $state(makeGraphUpdateEvent());

  // this is the reactive state to watch to determine when this embedding's graph
  // has updated. the formula for each entry is this = #data.graphUpdate + #update
  embeddingUpdate: GraphUpdateEvent = $state(makeGraphUpdateEvent());

  // get attributes() { return this.#data.frame.attributes; }
  attributes: GraphAttributes = $derived.by(() => ({
    ...this.#data.frame.attributes,
    dimension: this.#attributeDimension,
    hasLayerOrder: this.#attributeHasLayerOrder,
    class: EmbeddingType.foldedForm,
  }) as GraphAttributes);

  get selection(): FOLDSelection | undefined { return this.#data.frame.selection; }

  // todo
  get snapPoints(): [number, number][] {
    return [];
    // return this.#model.frame.vertices_coords?.map(resize3) ?? [];
  }

  get errors(): string[] {
    return [this.#foldedVerticesError, this.#faceOrdersError?.error]
      .filter(a => a !== undefined)
      .map(error => String(error));
  }

  constructor(data: GraphData) {
    this.#data = data;
    this.nearest = new Nearest(this);
    // this.#folded = new FoldedVertices(data);
    this.settings = new Settings();
    this.#effects = [
      this.#effectFaceOrdersSend(),
      this.#effectFaceOrdersReceive(),
      this.#effectFoldedVerticesNew(),
      this.#effectGraphUpdate(),
      this.#effectDebug(),
    ];
    // console.log("FoldedForm: constructor()", context.workerManager.faceOrders);
    this.faceOrdersWorker = new Worker(
      new URL("../../workers/dispatch.worker.js", import.meta.url),
      { type: "module", name: "layer-solver-manager" },
    );
    this.faceOrdersWorker.addEventListener("message", this.#onFaceOrdersMessage.bind(this));
    this.faceOrdersWorker.addEventListener("error", this.#onFaceOrdersError.bind(this));
  }

  dealloc(): void {
    this.#effects.forEach(fn => fn());
    this.faceOrdersWorker.removeEventListener("message", this.#onFaceOrdersMessage);
    this.faceOrdersWorker.removeEventListener("error", this.#onFaceOrdersError);
    // console.log("FoldedForm: dealloc()", context.workerManager.faceOrders);
  }

  #assembleGraph(): FOLD | undefined {
    if (!this.#data.frame.graph) { return undefined; }
    return {
      ...this.#data.frame.graph,
      frame_classes: ["foldedForm"],
      vertices_coords: this.#vertices_coords ?? [],
      faceOrders: this.#faceOrders ?? [],
    };
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

  #onFaceOrdersMessage({ data }: MessageEvent) {
    // console.log("LayerOrder worker responded with a message", data.result);
    this.#faceOrdersError = undefined;
    this.#faceOrdersResult = { uuid: data.uuid, result: data.result };
  }

  #onFaceOrdersError(error: ErrorEvent) {
    console.log("LayerOrder worker responded with an error", error);
    this.#faceOrdersResult = undefined;
    this.#faceOrdersError = { uuid: "", error: error.error };
    // todo implement uuid on the error web worker
    // this.#faceOrdersError = { uuid: error.uuid, error: error.error };
  }

  #updateVertices(): void {
    // two options:
    // (1) do not fold vertices, simply grab them from the source graph
    // (2) compute the folded vertices from the source graph
    if (!this.settings.foldVerticesCoords || this.#data.frame.attributes.class === EmbeddingType.foldedForm) {
      this.#foldedVerticesError = undefined;
      this.#vertices_coords = this.#data.frame.graph?.vertices_coords;
    } else {
      try {
        this.#foldedVerticesError = undefined;
        this.#vertices_coords = makeVerticesCoordsFolded(this.#data.frame.graph);
      } catch (err: unknown) {
        this.#foldedVerticesError = err instanceof Error ? err : new Error(String(err));
        this.#vertices_coords = undefined;
      }
    }
    // no matter which option from before, compute the dimension of the (folded or not) vertices
    try {
      this.#attributeDimension = getDimensionQuick({ vertices_coords: this.#vertices_coords }) ?? 3;
    } catch {
      this.#attributeDimension = 3;
    }
  }

  #effectFoldedVerticesNew(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = [
          this.#data.graphUpdate.reset,
          this.#data.graphUpdate.structural,
          this.#data.graphUpdate.isomorphic.coords,
          this.#data.graphUpdate.isomorphic.assignments,
          this.#data.graphUpdate.isomorphic.foldAngles,
        ];
        this.#updateVertices();
        this.graph = this.#assembleGraph();
        this.#update.isomorphic.coords++;
        console.log("FoldedForm(): new vertices_coords. assembling graph");
      });
      return () => { };
    });
  }

  #effectFaceOrdersSend(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = [
          this.#data.graphUpdate.reset,
          this.#data.graphUpdate.structural,
          this.#data.graphUpdate.isomorphic.coords,
        ];
        if (!this.settings.foldVerticesCoords) {
          this.#faceOrdersResult = undefined;
          this.#faceOrdersError = undefined;
          return;
        }
        if (!this.settings.solveFaceOrders) {
          this.#faceOrdersResult = undefined;
          this.#faceOrdersError = undefined;
          return;
        }
        // if (!this.#folded.vertices_coords) { return; }
        if (!this.#vertices_coords) {
          console.log("FoldedForm(): face orders WILL NOT send... (no folded vertices_coords)");
          this.#faceOrdersResult = undefined;
          this.#faceOrdersError = undefined;
          return;
        }
        if (this.#data.frame.graph.faceOrders) {
          // todo:
          return;
        }
        console.log("FoldedForm(): face orders send...");
        const graph = {
          ...this.graph,
          vertices_coords: this.#vertices_coords,
        };
        const uuid = this.#data.frame.uuid;
        this.faceOrdersWorker.postMessage({ uuid, graph });
      });
      return () => { };
    });
  }

  #effectFaceOrdersReceive(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (!this.settings.solveFaceOrders) {
          this.#faceOrders = undefined;
          this.#attributeHasLayerOrder = false;
          this.#update.isomorphic.faceOrders++;
          return;
        }
        if (!this.#faceOrdersResult) {
          this.#faceOrders = undefined;
          this.#attributeHasLayerOrder = false;
          this.#update.isomorphic.faceOrders++;
          return;
        }
        this.#faceOrders = this.#faceOrdersResult !== undefined
          ? this.#faceOrdersResult.result
          : undefined;
        const hasFaceOrders = this.#faceOrdersResult != null
          && this.#faceOrdersResult.result != null
          && this.#faceOrdersResult.uuid === this.#data.frame.uuid
          && this.#faceOrdersResult.result.length > 0;
        console.log("FoldedForm(): face orders receive", hasFaceOrders, this.#faceOrders?.length);
        this.#attributeHasLayerOrder = hasFaceOrders;
        this.attributes.hasLayerOrder = this.#attributeHasLayerOrder;
        this.graph = this.#assembleGraph();
        this.#update.isomorphic.faceOrders++;
      });
      return () => { };
    });
  }

  #effectDebug(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = this.#data.graphUpdate.isomorphic.foldAngles;
        console.log("FoldedForm(): foldAngles did update");
      });
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

