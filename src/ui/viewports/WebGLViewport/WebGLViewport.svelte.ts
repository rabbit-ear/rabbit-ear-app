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
import { Models } from "./Models.svelte.ts";
import { GLModels } from "./GLModels.svelte.ts";
import { Settings } from "./Settings.svelte.ts";
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
  // models: Models;
  glModels: GLModels;

  #gl: WebGLRenderingContext | WebGL2RenderingContext | undefined = $state();
  version: number = $state(2);

  get gl(): WebGLRenderingContext | WebGL2RenderingContext | undefined { return this.#gl; }
  set gl(context: WebGLRenderingContext | WebGL2RenderingContext | undefined) {
    // this.models.dealloc();
    // this.glModels.dealloc();
    this.#gl = context;
  }

  modelName = $state("creasePattern");
  model?: Model = $derived(context.fileManager.document?.model[this.modelName]);

  // layer?: unknown = $state();
  // props?: unknown = $state();

  redraw?: () => void = $state();

  effects: (() => void)[];

  constructor() {
    this.id = String(Math.random());
    this.component = ViewportComponent;
    this.dropdown = Dropdown;
    this.view = new WebGLView(this);
    this.style = new Style(this);
    // this.models = new Models(this);
    this.glModels = new GLModels(this);
    this.effects = [this.makeFrameAttributesEffect()];
    // this.setModelStyle(this.model.style);
  }

  setModelStyle(modelStyle: FrameAttributes): void {
    if (!modelStyle) { return; }
    // set initial state using the model style
    this.view.perspective = modelStyle.dimension === 2 ? "orthographic" : "perspective";
    this.style.renderStyle = modelStyle.isFoldedForm ? "foldedForm" : "creasePattern";
    this.style.opacity = modelStyle.hasLayerOrder ? 1.0 : 0.2;
    // todo: something else to tell it to draw transparent faces
    this.style.frontColor = this.style.opacity === 1 ? this.style.frontColor : "#999";
    this.style.backColor = this.style.opacity === 1 ? this.style.backColor : "#999";
    this.style.outlineColor = this.style.opacity === 1 ? this.style.outlineColor : "white";
  }

  makeFrameAttributesEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (this.model) {
          this.setModelStyle(this.model.attributes);
        }
      });
      // empty
      return () => { };
    });
  }

  unbindTool(): void {
    console.log("WebGLViewport unbindTool()");
    // this.models.unbindTool();
    // this.layer = undefined;
    // this.props = undefined;
  }

  dealloc(): void {
    this.effects.forEach((cleanup) => cleanup());
    // this.models.dealloc();
    this.glModels.dealloc();
  }
}

