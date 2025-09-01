import type { Snap } from "../Snap.ts";
import type { SnapResult, LineType } from "../Snap.ts";
import { distance2, resize2 } from "rabbit-ear/math/vector.js";
import { SVGViewport } from "./SVGViewport.svelte.ts";
import {
  triangleGridSnapFunction,
  squareGridSnapFunction,
  emptySnapFunction,
} from "../../../general/gridSnap.ts";

export class SVGSnap implements Snap {
  viewport: SVGViewport;

  snapRadius: number = $derived
    .by(() => this.viewport.view.vmax * SVGViewport.settings.snapRadiusFactor);
  // .by(() => this.viewport.view.vmax * this.viewport.constructor.settings.snapRadiusFactor);

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

  snapToPoint(point: [number, number]): SnapResult | undefined {
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

  snapToLine(point: [number, number], lines: LineType[]): SnapResult | undefined {
    return undefined;
  }

  // snapToPoint(point: [number, number]): SnapResultOld {
  //   return snapToPointOrGrid(
  //     point,
  //     this.snapRadius,
  //     this.#snapPoints,
  //     this.gridSnapFunction,
  //   );
  // }

  // snapToLine(point: [number, number], lines: LineType[]): SnapResultOld {
  //   return snapToLineOrPointOrGrid(
  //     point,
  //     this.snapRadius,
  //     lines,
  //     this.#snapPoints,
  //     this.gridSnapFunction,
  //   );
  // }

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
  }
}

