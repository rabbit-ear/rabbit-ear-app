import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
// import type { Shape } from "../geometry/shapes.ts";
import type { GraphUpdateEvent } from "./Updated.ts";
import type { VertexBVHType, EdgeBVHType, FaceBVHType } from "../general/BVHGraph.ts";
import type { FrameAttributes } from "./FrameAttributes.ts";
import type { FOLDSelection } from "../general/selection.ts";

// we need a fine tuned update system
// instead of subscribing to the graph,
// subscribe to the update object.
export interface Embedding {
  name: string;
  abbreviation: string;
  errors: string[];
  panel?: Component;

  // get the (compiled if necessary) FOLD graph
  // this graph will not be reactive, instead, watch
  // for the graph update metadata for reactive updates.
  graph: FOLD | undefined;

  // the reactive metadata which will be updated when
  // the graph updates, and contains more fine-tuned
  // information about how the graph just changed
  graphUpdate: GraphUpdateEvent;

  attributes: FrameAttributes;

  // selection is stored on the GraphData.
  // this is here for convenience, should reference the GraphData.
  selection: FOLDSelection | undefined;

  // other
  // shapes: Shape[];

  // some optional properties that might exist
  snapPoints?: [number, number][] | [number, number, number][];

  nearestVertex(point: [number, number]): VertexBVHType;
  nearestEdge(point: [number, number]): EdgeBVHType;
  nearestFace(point: [number, number]): FaceBVHType;

  nearestSnapPoint(point: [number, number]): {
    coords: [number, number] | [number, number, number],
    dist: number,
  } | undefined;

  // the Simulator Embedding in particular uses this to dealloc WebGL things
  dealloc?: () => void;
}

