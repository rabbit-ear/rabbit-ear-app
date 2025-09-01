import { distance2, resize2 } from "rabbit-ear/math/vector.js";
import type { SnapResult, LineType, SnapResultNew } from "./snap.ts";
import { SVGViewport } from "./SVGViewport.svelte.ts";
import {
  snapToPointOrGrid,
  snapToLineOrPointOrGrid,
} from "./snap.ts";
import {
  triangleGridSnapFunction,
  squareGridSnapFunction,
  emptySnapFunction,
} from "./gridSnap.ts";

export class Snap {
  viewport: SVGViewport;

  // This is the radius of the snapping range to the
  // nearest snappable point, it is dependent upon the current view zoom.
  snapRadius: number = $derived
    .by(() => this.viewport.view.vmax * SVGViewport.settings.snapRadiusFactor);

  points: [number, number][] = $state([]);

  // todo: get rid of resize2
  #snapPoints: [number, number][] = $derived.by(() =>
    ([] as [number, number][])
      .concat(this.points)
      .concat(this.viewport.embedding?.snapPoints.map(resize2)),
  );

  gridSnapFunction: (
    point: [number, number],
    snapRadius: number,
  ) => [number, number] | undefined = $derived.by(() => {
    switch (SVGViewport.settings.tiling) {
      case "triangle":
        return triangleGridSnapFunction;
      case "square":
        return squareGridSnapFunction;
      default:
        return emptySnapFunction;
    }
  });

  snapToPoint(point: [number, number]): SnapResultNew | undefined {
    const graphPoint = this.viewport.embedding?.nearestSnapPoint(point);
    const gridSnapCoords = this.gridSnapFunction(point, this.snapRadius);
    const gridPoint = gridSnapCoords
      ? { coords: gridSnapCoords, dist: distance2(point, gridSnapCoords) }
      : undefined;
    return [graphPoint, gridPoint]
      .filter(a => a !== undefined)
      .sort((a, b) => b.dist - a.dist)
      .pop();
  }

  // snapToPoint(point: [number, number]): SnapResult {
  //   return snapToPointOrGrid(
  //     point,
  //     this.snapRadius,
  //     this.#snapPoints,
  //     this.gridSnapFunction,
  //   );
  // }

  snapToLine(point: [number, number], lines: LineType[]): SnapResult {
    return snapToLineOrPointOrGrid(
      point,
      this.snapRadius,
      lines,
      this.#snapPoints,
      this.gridSnapFunction,
    );
  }

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
  }
}

