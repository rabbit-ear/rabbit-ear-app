import { View } from "./View.svelte.ts";
import settings from "./Settings.svelte.ts";

export class Style {
  view: View;
  constructor(view: View) {
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
