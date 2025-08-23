import { untrack, type Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Embedding } from "../Embedding.ts";
import type { FrameAttributes } from "../FrameAttributes.ts";
import type { GraphData } from "../GraphData.svelte.ts";
// import type { Shape } from "../../geometry/shapes.ts";
import { makeVerticesCoordsFolded } from "rabbit-ear/graph/vertices/folded.js";
import { getDimensionQuick } from "rabbit-ear/fold/spec.js";
import { Settings } from "./Settings.svelte.ts";
import Panel from "./Panel.svelte";
import type { GraphUpdateEvent } from "../Updated.ts";

export class FoldedForm implements Embedding {
  name: string = "foldedForm";
  abbreviation: string = "folded";
  panel: Component = Panel;

  #data: GraphData;
  settings: Settings;
  #effects: (() => void)[];

  get foldedVerticesResultAndErrors(): {
    error: Error | undefined;
    result: [number, number][] | [number, number, number][];
  } {
    if (this.#data.frameAttributes?.isFoldedForm) {
      return { error: undefined, result: this.#data.frame.vertices_coords ?? [] };
    }
    if (!this.settings.active) {
      return { error: new Error("automatic folding currently off"), result: [] };
    }
    try {
      return { error: undefined, result: makeVerticesCoordsFolded(this.#data.frame) };
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

  get attributes(): FrameAttributes {
    return {
      isFoldedForm: true,
      dimension: getDimensionQuick({ vertices_coords: this.vertices_coords }) ?? 2,
      // isAbstract:
      //   (this.graph?.vertices_coords &&
      //     !this.graph?.edges_vertices &&
      //     !this.graph?.faces_vertices) ?? false,
      isAbstract:
        (this.#data.frame.vertices_coords &&
          !this.#data.frame.edges_vertices &&
          !this.#data.frame.faces_vertices) ?? false,
      hasLayerOrder: this.#data.frame.faceOrders != null,
    };
  }

  // get shapes(): Shape[] {
  //   return this.#models.shapes;
  // }

  //faceOrders: [number, number, number][] = $state.raw([]);

  // get graph(): FOLD | undefined {
  //   return {
  //     //...$state.snapshot(this.graph),
  //     ...this.#data.frame,
  //     vertices_coords: this.vertices_coords,
  //     //faceOrders: this.faceOrders,
  //     frame_classes: ["foldedForm"],
  //   };
  // }

  graph: FOLD | undefined;

  graphUpdate: GraphUpdateEvent = $state({ isomorphic: { coords: false } });

  constructor(data: GraphData) {
    this.#data = data;
    this.settings = new Settings();
    this.#effects = [
      this.#effectGraphUpdate(),
    ];
  }

  dealloc(): void {
    this.#effects.forEach(fn => fn());
  }

  // conditions for updating the graph: 
  // - it always updates (any changes to the source frame)
  #effectGraphUpdate(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = this.#data.frame;
        untrack(() => {
          this.graph = {
            //...$state.snapshot(this.graph),
            ...this.#data.frame,
            vertices_coords: this.vertices_coords,
            //faceOrders: this.faceOrders,
            frame_classes: ["foldedForm"],
          };
        });
        this.graphUpdate = { structural: true, reset: true };
      });
      // empty
      return () => { };
    });
  }
}

