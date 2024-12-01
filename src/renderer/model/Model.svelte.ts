import type { FOLD } from "rabbit-ear/types.d.ts";
import type { Shape } from "../geometry/shapes.ts";
import type { FrameStyle } from "../file/FrameStyle.ts";

export interface IModel {
  name: string;
  abbreviation: string;

  // get the (compiled if necessary) FOLD graph
  fold: FOLD;

  style: FrameStyle;

  // other
  shapes: Shape[];

  // some optional properties that might exist
  snapPoints?: [number, number][] | [number, number, number][];

  dealloc?: () => void;
}
