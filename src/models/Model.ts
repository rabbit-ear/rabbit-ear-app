import type { Component } from "svelte";
import type { FOLD } from "rabbit-ear/types.d.ts";
// import type { Shape } from "../geometry/shapes.ts";
import type { FrameStyle } from "./FrameStyle.ts";

export interface Model {
  name: string;
  abbreviation: string;
  errors: string[];
  panel?: Component;

  // get the (compiled if necessary) FOLD graph
  graph: FOLD;

  style: FrameStyle;

  // other
  // shapes: Shape[];

  // some optional properties that might exist
  snapPoints?: [number, number][] | [number, number, number][];

  // the Simulator Model in particular uses this to dealloc WebGL things
  dealloc?: () => void;
}
