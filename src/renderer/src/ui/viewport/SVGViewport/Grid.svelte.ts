import { makeSquareGrid, makeTriangleGrid } from "./grid.ts";
import { View } from "./View.svelte.ts";
import settings from "./Settings.svelte.ts";

export class Grid {
  view: View;

  strokeWidth = $derived.by(() => this.view.vmax / 400);

  lines = $derived.by(() => {
    switch (settings.tiling) {
      case "triangle":
        return makeTriangleGrid(this.view.cameraViewBox);
      case "square":
        return makeSquareGrid(this.view.cameraViewBox);
      default:
        return [];
    }
  });

  constructor(view: View) {
    this.view = view;
  }
}

