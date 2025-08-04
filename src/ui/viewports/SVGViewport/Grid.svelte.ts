import { makeSquareGrid, makeTriangleGrid } from "./grid.ts";
import { SVGViewport } from "./SVGViewport.svelte.ts";

export class Grid {
  viewport: SVGViewport;

  strokeWidth = $derived.by(() => this.viewport.view.vmax / 400);

  lines = $derived.by(() => {
    switch (SVGViewport.settings.tiling) {
      case "triangle":
        return makeTriangleGrid(this.viewport.view.cameraViewBox);
      case "square":
        return makeSquareGrid(this.viewport.view.cameraViewBox);
      default:
        return [];
    }
  });

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
  }
}
