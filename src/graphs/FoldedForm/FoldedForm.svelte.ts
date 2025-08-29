import { untrack, type Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import { FrameClass, type Embedding } from "../Embedding.ts";
import type { FrameAttributes } from "../FrameAttributes.ts";
import type { GraphData } from "../GraphData.svelte.ts";
import type { GraphUpdateEvent } from "../Updated.ts";
import type { EdgeBVHType, FaceBVHType, VertexBVHType } from "../../general/BVHGraph.ts";
// import type { Shape } from "../../geometry/shapes.ts";
import { makeVerticesCoordsFolded } from "rabbit-ear/graph/vertices/folded.js";
import { makeGraphUpdateEvent } from "../Updated.ts";
import { Settings } from "./Settings.svelte.ts";
import Panel from "./Panel.svelte";

export class FoldedForm implements Embedding {
  name: string = "foldedForm";
  abbreviation: string = "folded";
  panel: Component = Panel;

  #data: GraphData;
  settings: Settings;
  #effects: (() => void)[];

  graph: FOLD | undefined;

  graphUpdate: GraphUpdateEvent = $state(makeGraphUpdateEvent());

  sourceIsFoldedForm: boolean = $derived.by(() => this.#data.frame.attributes.isFoldedForm);

  setGraph(newGraph: FOLD | undefined) {
    untrack(() => {
      this.graph = {
        // ...$state.snapshot(newGraph),
        ...newGraph,
        vertices_coords: this.vertices_coords,
        // faceOrders: this.faceOrders,
        frame_classes: ["foldedForm"],
      };
    });
    this.graphUpdate.reset++;
    // this.graphUpdate.structural++;
  }

  //faceOrders: [number, number, number][] = $state.raw([]);

  get foldedVerticesResultAndErrors(): {
    error: Error | undefined;
    result: [number, number][] | [number, number, number][];
  } {
    if (!this.settings.active) {
      return { error: new Error("automatic folding currently off"), result: [] };
    }
    try {
      return this.#data.frame.attributes.isFoldedForm
        ? { error: undefined, result: this.#data.frame.baked.vertices_coords ?? [] }
        : { error: undefined, result: makeVerticesCoordsFolded(this.#data.frame.baked) };
    } catch (err: unknown) {
      const error = err instanceof Error
        ? err
        : new Error(String(err));
      return { error, result: [] };
    }
  }

  get vertices_coords(): [number, number][] | [number, number, number][] {
    return this.foldedVerticesResultAndErrors.result;
  };

  // todo
  get snapPoints(): [number, number][] {
    return [];
    // return this.#model.frame.vertices_coords?.map(resize3) ?? [];
  }

  //#layerOrderErrors: string[] = $state([]);

  get errors(): string[] {
    return this.foldedVerticesResultAndErrors.error
      ? [`${this.foldedVerticesResultAndErrors.error}`]
      : [];
  }

  attributes = $derived.by(() => ({
    frameClass: FrameClass.foldedForm,
    dimension: this.#data.frame.attributes.dimension,
    layerOrder: this.#data.frame.attributes.hasLayerOrder,
  }));

  // get shapes(): Shape[] {
  //   return this.#models.shapes;
  // }

  constructor(data: GraphData) {
    this.#data = data;
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

