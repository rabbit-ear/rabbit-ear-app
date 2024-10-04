import { View } from "./View.svelte.ts";
import settings from "./Settings.svelte.ts";

export class Style {
  view: View;
  constructor(view: View) {
    this.view = view;
  }

  circleRadius = $derived.by(
    () => Math.min(this.view.viewBox[2], this.view.viewBox[3]) * settings.vertexRadiusFactor,
  );

  strokeWidth = $derived.by(() =>
    Math.max(
      settings.strokeWidthAbsoluteMin,
      Math.min(this.view.viewBox[2], this.view.viewBox[3]) * settings.strokeWidthFactor,
    ),
  );

  strokeDashLength = $derived(this.strokeWidth * 8);
}

