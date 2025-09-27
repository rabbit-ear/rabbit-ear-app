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
  settings: Settings;

  #data: GraphData;
  #folded: FoldedVertices;
  #effects: (() => void)[];

  faceOrdersWorker: Worker;

  #vertices_coords: [number, number][] | [number, number, number][] | undefined;
  #faceOrders: [number, number, number][] | undefined;

  #faceOrdersResult: { uuid: string, result: [number, number, number][] } | undefined = $state.raw();
  #faceOrdersError: { uuid: string, error: Error } | undefined = $state();

  #attributeDimension: number = $state(3);
  #attributeHasLayerOrder: boolean = $state(false);

  get graph(): FOLD | undefined {
    return {
      ...this.#data.frame.graph,
      frame_classes: ["foldedForm"],
      vertices_coords: this.#vertices_coords ?? [],
      faceOrders: this.#faceOrders ?? [],
    };
  };

  #graphUpdate: GraphUpdateEvent = $derived.by(() => this.#data.graphUpdate);
  #update: GraphUpdateEvent = $state(makeGraphUpdateEvent());
  embeddingUpdate: GraphUpdateEvent = $state(makeGraphUpdateEvent());
  // embeddingUpdate: GraphUpdateEvent = $derived({
  //   isomorphic: {
  //     coords: this.#data.graphUpdate.isomorphic.coords + this.#update.isomorphic.coords,
  //     assignments: this.#data.graphUpdate.isomorphic.assignments + this.#update.isomorphic.assignments,
  //     foldAngles: this.#data.graphUpdate.isomorphic.foldAngles + this.#update.isomorphic.foldAngles,
  //     faceOrders: this.#data.graphUpdate.isomorphic.faceOrders + this.#update.isomorphic.faceOrders,
  //   },
  //   reset: this.#data.graphUpdate.reset + this.#update.reset,
  //   structural: this.#data.graphUpdate.structural + this.#update.structural,
  //   selection: this.#data.graphUpdate.selection + this.#update.selection,
  // });

  // get attributes() { return this.#data.frame.attributes; }
  // attributes = $derived.by(() => this.#data.frame.attributes);
  attributes: FrameAttributes = $derived.by(() => ({
    ...this.#data.frame.attributes,
    hasLayerOrder: this.#attributeHasLayerOrder,
    dimension: this.#attributeDimension,
  }) as FrameAttributes);

  get selection(): FOLDSelection | undefined { return this.#data.frame.selection; }

  // todo
  get snapPoints(): [number, number][] {
    return [];
    // return this.#model.frame.vertices_coords?.map(resize3) ?? [];
  }

  get errors(): string[] {
    return [this.#folded.error, this.#faceOrdersError?.error]
      .filter(a => a !== undefined)
      .map(error => String(error));
  }

  constructor(data: GraphData) {
    this.#data = data;
    this.#folded = new FoldedVertices(data);
    this.settings = new Settings();
    this.#effects = [
      this.#effectFaceOrdersSend(),
      this.#effectFaceOrdersReceive(),
      this.#effectFoldedVertices(),
      this.#effectGraphUpdate(),
      this.#effectDebug(),
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
    this.#faceOrdersError = undefined;
    this.#faceOrdersResult = { uuid: data.uuid, result: data.result };
  }

  onFaceOrdersError(error: ErrorEvent) {
    console.log("LayerOrder worker responded with an error", error);
    this.#faceOrdersResult = undefined;
    this.#faceOrdersError = { uuid: "", error: error.error };
    // todo implement uuid on the error web worker
    // this.#faceOrdersError = { uuid: error.uuid, error: error.error };
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

  #effectFoldedVertices(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (!this.settings.foldVerticesCoords) {
          this.#vertices_coords = this.#data.frame.graph?.vertices_coords;
          this.#update.isomorphic.coords++;
          return;
        }
        console.log("$effect: FoldedForm(): folded vertices");
        this.#vertices_coords = this.#folded.vertices_coords;
        try {
          this.#attributeDimension = getDimensionQuick({ vertices_coords: this.#vertices_coords }) ?? 3;
        } catch {
          this.#attributeDimension = 3;
        }
        this.#update.isomorphic.coords++;
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
        // const _ = [
        //   this.embeddingUpdate.reset,
        //   this.embeddingUpdate.structural,
        //   this.embeddingUpdate.isomorphic.coords,
        // ];
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
        if (!this.#folded.vertices_coords) {
          this.#faceOrdersResult = undefined;
          this.#faceOrdersError = undefined;
          return;
        }
        console.log("$effect: FoldedForm(): face orders send...");
        const graph = {
          ...this.graph,
          vertices_coords: this.#folded.vertices_coords,
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
        console.log("$effect: FoldedForm(): face orders receive", hasFaceOrders, this.#faceOrders?.length);
        this.#attributeHasLayerOrder = hasFaceOrders;
        this.attributes.hasLayerOrder = this.#attributeHasLayerOrder;
        this.#update.isomorphic.faceOrders++;
      });
      return () => { };
    });
  }

  #effectDebug(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = this.embeddingUpdate.isomorphic.foldAngles
        console.log("FoldedForm(): foldAngles did update");
      });
      return () => { };
    });
  }

  #effectGraphUpdate(): () => void {
    return $effect.root(() => {
      $effect(() => {
        this.embeddingUpdate.isomorphic.coords = this.#graphUpdate.isomorphic.coords + this.#update.isomorphic.coords;
      });
      $effect(() => {
        this.embeddingUpdate.isomorphic.assignments = this.#graphUpdate.isomorphic.assignments + this.#update.isomorphic.assignments;
      });
      $effect(() => {
        this.embeddingUpdate.isomorphic.foldAngles = this.#graphUpdate.isomorphic.foldAngles + this.#update.isomorphic.foldAngles;
      });
      $effect(() => {
        this.embeddingUpdate.isomorphic.faceOrders = this.#graphUpdate.isomorphic.faceOrders + this.#update.isomorphic.faceOrders;
      });
      $effect(() => { this.embeddingUpdate.reset = this.#graphUpdate.reset + this.#update.reset; });
      $effect(() => { this.embeddingUpdate.structural = this.#graphUpdate.structural + this.#update.structural; });
      $effect(() => { this.embeddingUpdate.selection = this.#graphUpdate.selection + this.#update.selection; });

      return () => { };
    });
  }

}

