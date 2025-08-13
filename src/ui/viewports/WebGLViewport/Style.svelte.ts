import { WebGLViewport } from "./WebGLViewport.svelte.ts";

export class Style {
  viewport: WebGLViewport;

  //frontColor: renderStyle === RenderStyle.translucent ? "#9e9b9b" : Renderer.FrontColor,
  //backColor: renderStyle === RenderStyle.translucent ? "#9e9b9b" : Renderer.BackColor,
  //outlineColor: renderStyle === RenderStyle.translucent ? "white" : "black",
  //opacity: renderStyle === RenderStyle.translucent ? 0.25 : 1,

  renderStyle: string = $state("creasePattern");

  darkMode: boolean = $state(true);
  frontColor: string = $state("#1177FF");
  backColor: string = $state("#ffffff");
  outlineColor: string = $state("black");
  opacity: number = $state(1);

  showFoldedFaceOutlines: boolean = $state(true);
  showFoldedCreases: boolean = $state(false);
  showFoldedFaces: boolean = $state(true);

  circleRadius = $derived.by(() => this.viewport.view.vmin * WebGLViewport.settings.vertexRadiusFactor);

  strokeWidth = $derived.by(() =>
    Math.max(
      WebGLViewport.settings.strokeWidthAbsoluteMin,
      this.viewport.view.vmin * WebGLViewport.settings.strokeWidthFactor,
    ),
  );

  strokeDashLength = $derived(this.strokeWidth * 8);

  layersNudge = $derived(WebGLViewport.settings.layersNudge);

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
  }
}

