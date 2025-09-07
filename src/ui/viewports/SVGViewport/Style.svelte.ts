import { SVGViewport } from "./SVGViewport.svelte.ts";
import context from "../../../app/context.svelte.ts";

export class Style {
  viewport: SVGViewport;

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
  }

  showVertices: boolean = $derived(context.ui.settings.showVertices.value);
  showEdges: boolean = $derived(true);
  showFaces: boolean = $derived(true);

  // this is adjustable based on the settings property "vertex radius factor"
  circleRadius = $derived
    .by(() => this.viewport.view.vmin * SVGViewport.settings.vertexRadiusFactor);

  // this is adjustable based on the settings property "stroke width factor"
  // used in the rendering of the model
  strokeWidth = $derived.by(() =>
    Math.max(
      SVGViewport.settings.strokeWidthAbsoluteMin,
      this.viewport.view.vmin * SVGViewport.settings.strokeWidthFactor,
    ),
  );

  // this is a fixed-width and used in UI overlay elements
  strokeWidthFixed = $derived.by(() => this.viewport.view.vmin / 500);

  // do not fix this with the absolute min stroke width
  strokeDashLength = $derived.by(() => this.viewport.view.vmin / 100);
}

