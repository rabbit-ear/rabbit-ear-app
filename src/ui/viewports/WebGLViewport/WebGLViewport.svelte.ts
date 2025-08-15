import type { Component } from "svelte";
import type { Viewport } from "../Viewport";
import type { View } from "../View.ts";
import type { FrameAttributes } from "../../../models/FrameAttributes.ts";
import type { Model } from "../../../models/Model.ts";
import ViewportComponent from "./Component.svelte";
import Dropdown from "./Dropdown.svelte";
import ClassPanel from "./Panel.svelte";
import { WebGLView } from "./View.svelte.ts";
import { Style } from "./Style.svelte.ts";
import { GLModels } from "./GLModels.svelte.ts";
import { Settings } from "./Settings.svelte.ts";
import { RenderPerspective, RenderStyle } from "../types.ts";
import context from "../../../app/context.svelte.ts";

export class WebGLViewport implements Viewport {
  static name: string = "WebGL Viewport";
  static settings: Settings = new Settings();
  static panel: Component = ClassPanel;

  id: string;
  component: Component;
  dropdown: Component;
  domElement?: HTMLCanvasElement;
  didMount?: () => void;

  view: View;
  style: Style;
  glModels: GLModels;

  gl: WebGLRenderingContext | WebGL2RenderingContext | undefined = $state();
  version: number = $state(2);

  modelName = $state("creasePattern");
  model?: Model = $derived(context.fileManager.document?.model[this.modelName]);

  redraw?: () => void = $state();

  effects: (() => void)[];

  constructor() {
    this.id = String(Math.random());
    this.component = ViewportComponent;
    this.dropdown = Dropdown;
    this.view = new WebGLView(this);
    this.style = new Style(this);
    this.glModels = new GLModels(this);
    this.effects = [this.#modelStyleEffect()];
    // this.setModelStyle(this.model.style);
  }

  setModelStyle(modelStyle: FrameAttributes | undefined): void {
    if (!modelStyle) { return; }

    // render style is either: creasePattern, foldedForm, translucent
    if (modelStyle.isFoldedForm) {
      this.style.renderStyle = modelStyle.hasLayerOrder
        ? RenderStyle.foldedForm
        : RenderStyle.translucent;
    } else {
      this.style.renderStyle = RenderStyle.creasePattern;
    }

    this.view.perspective = modelStyle.dimension === 2
      ? RenderPerspective.orthographic
      : RenderPerspective.perspective;
  }

  #modelStyleEffect(): () => void {
    return $effect.root(() => {
      $effect(() => { this.setModelStyle(this.model?.attributes); });
      // empty
      return () => { };
    });
  }

  unbindTool(): void {
    console.log("WebGLViewport unbindTool()");
    this.glModels.unbindTool();
  }

  dealloc(): void {
    this.effects.forEach((cleanup) => cleanup());
    this.glModels.dealloc();
  }
}

