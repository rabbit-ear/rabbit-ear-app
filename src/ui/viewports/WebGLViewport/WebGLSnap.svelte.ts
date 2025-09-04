import type { Snap } from "../Snap.ts";
import type { SnapResult, LineType } from "../Snap.ts";
import { distance2, resize2 } from "rabbit-ear/math/vector.js";
import { WebGLViewport } from "./WebGLViewport.svelte.ts";
import {
  triangleGridSnapFunction,
  squareGridSnapFunction,
  emptySnapFunction,
} from "../../../general/gridSnap.ts";

export class WebGLSnap implements Snap {
  viewport: WebGLViewport;

  snapRadius: number = $derived
    .by(() => this.viewport.view.vmax * WebGLViewport.settings.snapRadiusFactor);
  // .by(() => this.viewport.view.vmax * this.viewport.constructor.settings.snapRadiusFactor);

  gridSnapFunction: (
    point: [number, number],
    snapRadius: number,
  ) => [number, number] | undefined = $derived.by(() => {
    switch (WebGLViewport.settings.tiling) {
      case "triangle":
        return triangleGridSnapFunction;
      case "square":
        return squareGridSnapFunction;
      default:
        return emptySnapFunction;
    }
  });

  snapToPoint(point: [number, number]): SnapResult | undefined {
    return undefined;
  }

  snapToLine(point: [number, number], lines: LineType[]): SnapResult | undefined {
    return undefined;
  }

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
  }
}

