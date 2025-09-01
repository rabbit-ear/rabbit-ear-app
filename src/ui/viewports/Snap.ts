import type { VecLine2 } from "rabbit-ear/types.js";

export type SnapResult = {
  coords: [number, number] | undefined;
  dist: number;
};

export type LineType = {
  line: VecLine2;
  clamp: (a: number) => number;
  domain: (_: number, __?: number) => boolean;
};

export abstract class Snap {
  // This is the radius of the snapping range to the
  // nearest snappable point, it is dependent upon the current view zoom.

  // a UI touch event, coming from a pointer device, will have some
  // built-in error correcting (like snapping, for example), and this behavior
  // is zoom-level dependent. Use this variable to get an appropriate error-
  // correcting value.
  abstract snapRadius: number;

  // todo: need to generalize this, or create a separate function which
  // takes in a 3D ray as the input. same for the snapToLine
  abstract snapToPoint(point: [number, number]): SnapResult | undefined;

  abstract snapToLine(point: [number, number], lines: LineType[]): SnapResult | undefined;
}

