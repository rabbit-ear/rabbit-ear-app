import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
// import type { Shape } from "../geometry/shapes.ts";
import type { FrameAttributes } from "./FrameAttributes.ts";
import type { FOLDSelection } from "../general/types.ts";

export type UpdateInfo = {
  newGraph: boolean;
  isomorphic: boolean;
};

// we need a fine tuned update system
// instead of subscribing to the graph,
// subscribe to the update object.
export interface Embedding {
  name: string;
  abbreviation: string;
  errors: string[];
  panel?: Component;

  // get the (compiled if necessary) FOLD graph
  graph: FOLD | undefined;

  // here:
  // updated: UpdateInfo = $state();

  attributes: FrameAttributes;

  // other
  // shapes: Shape[];

  // some optional properties that might exist
  snapPoints?: [number, number][] | [number, number, number][];

  selection?: FOLDSelection;

  nearestVertex?: (point: [number, number]) => object;
  nearestEdge?: (point: [number, number]) => object;
  nearestFace?: (point: [number, number]) => object;

  // the Simulator Embedding in particular uses this to dealloc WebGL things
  dealloc?: () => void;
}
