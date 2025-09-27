import type { Embedding } from "../../../graphs/Embedding.ts";
import { WebGLViewport } from "./WebGLViewport.svelte.ts";
import { RenderPerspective, RenderStyle } from "../types.ts";
import { CreasePattern } from "../../../graphs/CreasePattern/CreasePattern.svelte.ts";
import { FoldedForm } from "../../../graphs/FoldedForm/FoldedForm.svelte.ts";
import { Simulator } from "../../../graphs/Simulator/Simulator.svelte.ts";
import context from "../../../app/context.svelte.ts";

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

  #effects: (() => void)[];

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.#effects = [
      this.#modelStyleEffect(),
    ];
    // this.setModelStyle(this.viewport.embedding);
  }

  dealloc(): void {
    this.#effects.forEach(fn => fn());
  }

  // todo: this is a bit weird being here, as it contains code that modifies
  // not only this class, but also the View class.
  setModelStyle(embedding: Embedding | undefined): void {
    if (!embedding) { return; }
    // console.log("WebGLViewport() setModelStyle");

    switch (this.viewport.embedding?.constructor) {
      case CreasePattern:
        this.renderStyle = RenderStyle.creasePattern;
        break;
      case Simulator:
        this.renderStyle = RenderStyle.foldedForm;
        break;
      case FoldedForm:
      default:
        this.renderStyle = this.viewport.embedding?.attributes.hasLayerOrder
          ? RenderStyle.foldedForm
          : RenderStyle.translucent;
        break;
    }

    this.viewport.view.perspective = this.viewport.embedding?.attributes.dimension === 2
      ? RenderPerspective.orthographic
      : RenderPerspective.perspective;
  }

  #modelStyleEffect(): () => void {
    return $effect.root(() => {
      // console.log("WebGLViewport() setModelStyle $effect");
      $effect(() => { this.setModelStyle(this.viewport.embedding); });
      // empty
      return () => { };
    });
  }
}

