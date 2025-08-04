import { SVGViewport } from "./SVGViewport.svelte.ts";

export class Style {
  viewport: SVGViewport;

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
  }

  circleRadius = $derived.by(() => this.viewport.view.vmin * SVGViewport.settings.vertexRadiusFactor);

  strokeWidth = $derived.by(() =>
    Math.max(
      SVGViewport.settings.strokeWidthAbsoluteMin,
      this.viewport.view.vmin * SVGViewport.settings.strokeWidthFactor,
    ),
  );

  strokeDashLength = $derived(this.strokeWidth * 8);
}

