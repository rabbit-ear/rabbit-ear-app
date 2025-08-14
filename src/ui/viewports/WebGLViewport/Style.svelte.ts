import { WebGLViewport } from "./WebGLViewport.svelte.ts";
import context from "../../../app/context.svelte.ts";
import { RenderStyle } from "../types.ts";

export class Style {
  viewport: WebGLViewport;

  renderStyle: RenderStyle = $state(RenderStyle.creasePattern);

  darkMode: boolean = $derived(context.ui.settings.darkMode.value);

  opacity: number = $derived(this.renderStyle === RenderStyle.translucent
    ? context.ui.settings.modelOpacityTranslucent.value
    : context.ui.settings.modelOpacityOpaque.value);

  frontColor: string = $derived.by(() => this.renderStyle === RenderStyle.translucent
    ? context.ui.settings.modelColorTranslucent.value
    : context.ui.settings.modelColorFront.value);

  backColor: string = $derived.by(() => this.renderStyle === RenderStyle.translucent
    ? context.ui.settings.modelColorTranslucent.value
    : context.ui.settings.modelColorBack.value);

  outlineColor: string = $derived.by(() => this.renderStyle === RenderStyle.translucent
    ? "white"
    : context.ui.settings.modelColorOutline.value);

  cpColor: string = $derived.by(() => this.viewport.style.darkMode ? "#111111" : "white");

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

