import { makeSquareGrid, makeTriangleGrid } from "../../../general/grid.ts";
import { SVGViewport } from "./SVGViewport.svelte.ts";

export class Grid {
  viewport: SVGViewport;

  lines = $derived.by(() => {
    switch (SVGViewport.settings.tiling) {
      case "triangle":
        return makeTriangleGrid(this.viewport.view.cameraViewBox)
          .map(s => ({ x1: s[0][0], y1: s[0][1], x2: s[1][0], y2: s[1][1] }));
      case "square":
        return makeSquareGrid(this.viewport.view.cameraViewBox)
          .map(s => ({ x1: s[0][0], y1: s[0][1], x2: s[1][0], y2: s[1][1] }));
      default:
        return [];
    }
  });

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
  }
}
