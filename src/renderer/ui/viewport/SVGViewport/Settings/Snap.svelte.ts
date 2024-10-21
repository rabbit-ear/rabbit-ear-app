import type { SnapResult, LineType } from "./snap.ts";
import type { View } from "./View.svelte.ts";
import {
  snapToPointOrGrid,
  snapToLineOrPointOrGrid,
  triangleGridSnapFunction,
  squareGridSnapFunction,
} from "./snap.ts";
import settings from "./ClassSettings.svelte.ts";
import app from "../../../../app/App.svelte.ts";

const emptySnapFunction = (
  point: [number, number],
  snapRadius: number,
): [number, number] | undefined => {
  point;
  snapRadius;
  return undefined;
};

export class Snap {
  view: View;

  // This is the radius of the snapping range to the
  // nearest snappable point, it is dependent upon the current view zoom.
  snapRadius: number = $derived.by(() => this.view.vmax * settings.snapRadiusFactor);

  points: [number, number][] = $state([]);

  #snapPoints: [number, number][] = $derived(
    ([] as [number, number][]).concat(this.points).concat(app.file.geometry.snapPoints),
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

  constructor(view: View) {
    this.view = view;
  }
}
