import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Shape } from "../geometry/shapes.ts";
import type { ModelStyle } from "./ModelStyle.ts";

export interface IModel {
  name: string;

  // get the (compiled if necessary) FOLD graph
  fold: FOLD;

  style: ModelStyle;

  // other
  shapes: Shape[];

  // some optional properties that might exist
  snapPoints?: [number, number][] | [number, number, number][];

  dealloc?: () => void;
}
