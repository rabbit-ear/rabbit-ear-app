import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
// import type { Shape } from "../geometry/shapes.ts";
import type { FrameAttributes } from "./FrameAttributes.ts";
import type { FOLDSelection } from "../general/types.ts";

export interface Model {
  name: string;
  abbreviation: string;
  errors: string[];
  panel?: Component;

  // get the (compiled if necessary) FOLD graph
  graph: FOLD | undefined;

  attributes: FrameAttributes;

  // other
  // shapes: Shape[];

  // some optional properties that might exist
  snapPoints?: [number, number][] | [number, number, number][];

  selection?: FOLDSelection;

  // the Simulator Model in particular uses this to dealloc WebGL things
  dealloc?: () => void;
}
