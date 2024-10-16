import type { FOLD } from "rabbit-ear/types.js";
import { View } from "./View.svelte.ts";
import settings from "./Settings.svelte.ts";

export class Style {
  graph: FOLD;
  view: View;

  constructor(graph: FOLD, view: View) {
    this.graph = graph;
    this.view = view;
  }

  circleRadius = $derived.by(() => this.view.vmin * settings.vertexRadiusFactor);

  strokeWidth = $derived.by(() =>
    Math.max(
      settings.strokeWidthAbsoluteMin,
      this.view.vmin * settings.strokeWidthFactor,
    ),
  );

  strokeDashLength = $derived(this.strokeWidth * 8);
}
