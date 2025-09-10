import type { Component } from "svelte";
import type { Viewport } from "../Viewport";
import type { Embedding } from "../../../graphs/Embedding.ts";
import type { Ruler } from "../../../rulers/Ruler.ts";
import ViewportComponent from "./Component.svelte";
import Dropdown from "./Dropdown.svelte";
import ClassPanel from "./Panel.svelte";
import { WebGLView } from "./WebGLView.svelte.ts";
import { WebGLSnap } from "./WebGLSnap.svelte.ts";
import { Style } from "./Style.svelte.ts";
import { GLModels } from "./GLModels.svelte.ts";
import { Settings } from "./Settings.svelte.ts";
import { RenderPerspective, RenderStyle } from "../types.ts";
import { CreasePattern } from "../../../graphs/CreasePattern/CreasePattern.svelte.ts";
import { FoldedForm } from "../../../graphs/FoldedForm/FoldedForm.svelte.ts";
import { Simulator } from "../../../graphs/Simulator/Simulator.svelte.ts";
import context from "../../../app/context.svelte.ts";

export class WebGLViewport implements Viewport {
  static name: string = "WebGL Viewport";
  static settings: Settings = new Settings();
  static panel: Component = ClassPanel;

  id: string;
  component: Component;
  dropdown: Component;
  domElement?: HTMLCanvasElement;

  view: WebGLView;
  snap: WebGLSnap; // todo
  style: Style;
  glModels: GLModels;

  gl: WebGLRenderingContext | WebGL2RenderingContext | undefined = $state();
  version: number = $state(2);

  embeddingName = $state("creasePattern");
  embedding?: Embedding = $derived(context.fileManager.document?.data[this.embeddingName]);

  rulers?: Ruler[] = $derived(context.fileManager.document?.data.frame.rulers.allRulers);

  // in the HTMLCanvas component, the window onresize event will be
  // be bound to this. this is also necessary for setting the canvasSize.
  redraw?: () => void = $state();

  effects: (() => void)[];

  didMount?: () => void;

  constructor() {
    this.id = String(Math.random());
    this.component = ViewportComponent;
    this.dropdown = Dropdown;
    this.view = new WebGLView(this);
    this.snap = new WebGLSnap(this);
    this.style = new Style(this);
    this.glModels = new GLModels(this);
    this.effects = [
      this.#modelStyleEffect(),
    ];
    // this.setModelStyle(this.model.style);
  }

  setModelStyle(embedding: Embedding | undefined): void {
    if (!embedding) { return; }
    // console.log("WebGLViewport() setModelStyle");

    switch (this.embedding?.constructor) {
      case CreasePattern:
        this.style.renderStyle = RenderStyle.creasePattern;
        break;
      case Simulator:
        this.style.renderStyle = RenderStyle.foldedForm;
        break;
      case FoldedForm:
      default:
        this.style.renderStyle = this.embedding?.attributes.hasLayerOrder
          ? RenderStyle.foldedForm
          : RenderStyle.translucent;
        break;
    }

    this.view.perspective = this.embedding?.attributes.dimension === 2
      ? RenderPerspective.orthographic
      : RenderPerspective.perspective;
  }

  #modelStyleEffect(): () => void {
    return $effect.root(() => {
      // console.log("WebGLViewport() setModelStyle $effect");
      $effect(() => { this.setModelStyle(this.embedding); });
      // empty
      return () => { };
    });
  }

  unbindTool(): void {
    // console.log("WebGLViewport unbindTool()");
    this.glModels.unbindTool();
  }

  dealloc(): void {
    this.effects.forEach((cleanup) => cleanup());
    this.glModels.dealloc();
  }
}

