import { SVGViewport } from "./SVGViewport.svelte.ts";

export class Style {
  viewport: SVGViewport;

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
  }

  circleRadius = $derived.by(() => this.viewport.view.vmin * SVGViewport.settings.vertexRadiusFactor.value);

  strokeWidth = $derived.by(() =>
    Math.max(
      SVGViewport.settings.strokeWidthAbsoluteMin.value,
      this.viewport.view.vmin * SVGViewport.settings.strokeWidthFactor.value,
    ),
  );

  strokeDashLength = $derived(this.strokeWidth * 8);
}

