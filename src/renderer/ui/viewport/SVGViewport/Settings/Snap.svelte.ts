import { resize2 } from "rabbit-ear/math/vector.js";
import type { SnapResult, LineType } from "./snap.ts";
import type { SVGViewport } from "../SVGViewport.svelte.ts";
import type { View } from "./View.svelte.ts";
import {
  snapToPointOrGrid,
  snapToLineOrPointOrGrid,
  triangleGridSnapFunction,
  squareGridSnapFunction,
} from "./snap.ts";
import settings from "./Settings.svelte.ts";

const emptySnapFunction = (
  point: [number, number],
  snapRadius: number,
): [number, number] | undefined => {
  point;
  snapRadius;
  return undefined;
};

export class Snap {
  viewport: SVGViewport;
  view: View;

  // This is the radius of the snapping range to the
  // nearest snappable point, it is dependent upon the current view zoom.
  snapRadius: number = $derived.by(() => this.view.vmax * settings.snapRadiusFactor);

  points: [number, number][] = $state([]);

  // todo: get rid of resize2
  #snapPoints: [number, number][] = $derived.by(() =>
    ([] as [number, number][])
      .concat(this.points)
      .concat(this.viewport.model?.snapPoints.map(resize2)),
  );

  gridSnapFunction: (
    point: [number, number],
    snapRadius: number,
  ) => [number, number] | undefined = $derived.by(() => {
    switch (settings.tiling) {
      case "triangle":
        return triangleGridSnapFunction;
      case "square":
        return squareGridSnapFunction;
      default:
        return emptySnapFunction;
    }
  });

  snapToPoint(point: [number, number]): SnapResult {
    return snapToPointOrGrid(
      point,
      this.snapRadius,
      this.#snapPoints,
      this.gridSnapFunction,
    );
  }

  snapToLine(point: [number, number], lines: LineType[]): SnapResult {
    return snapToLineOrPointOrGrid(
      point,
      this.snapRadius,
      lines,
      this.#snapPoints,
      this.gridSnapFunction,
    );
  }

  constructor(viewport: SVGViewport, view: View) {
    this.viewport = viewport;
    this.view = view;
  }
}
