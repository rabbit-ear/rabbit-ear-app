import type { Component } from "svelte";
import type { IModel } from "../../../model/Model.svelte.ts";
import type { ModelStyle } from "../../../model/ModelStyle.ts";
import type {
  IModelViewport,
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportTouchEvent,
} from "../ViewportTypes.ts";
import { unsetViewportEvents } from "../ViewportTypes.ts";
import ViewportComponent from "./ViewportComponent.svelte";
import Dropdown from "./Dropdown.svelte";
import Panel from "./Panel.svelte";
import { View } from "./Settings/View.svelte.ts";
import settings from "./Settings/ClassSettings.svelte.ts";
import app from "../../../app/App.svelte.ts";

//class Style {
//  view: View;
//  constructor(view: View) {
//    this.view = view;
//  }
//}

export class WebGLViewport implements IModelViewport {
  static settings = settings;
  static panel: Component = Panel;

  component: Component;
  panel: Component;

  model?: IModel = $state.raw();

  view: View;
  //style: Style;

  redraw?: () => void = $state();

  onmousemove?: (event: ViewportMouseEvent) => void;
  onmousedown?: (event: ViewportMouseEvent) => void;
  onmouseup?: (event: ViewportMouseEvent) => void;
  onmouseleave?: (event: ViewportMouseEvent) => void;
  onwheel?: (event: ViewportWheelEvent) => void;
  ontouchstart?: (event: ViewportTouchEvent) => void;
  ontouchend?: (event: ViewportTouchEvent) => void;
  ontouchmove?: (event: ViewportTouchEvent) => void;
  ontouchcancel?: (event: ViewportTouchEvent) => void;
  onkeydown?: (event: KeyboardEvent) => void;
  onkeyup?: (event: KeyboardEvent) => void;

  effects: (() => void)[];

  // layer?: unknown = $state();
  // props?: unknown = $state();

  constructor() {
    this.component = ViewportComponent;
    this.panel = Dropdown;
    this.view = new View();
    //this.style = new Style(this.view);
    //this.model = app.models.cp;
    this.model = app.models.folded;
    this.effects = [this.makeFrameStyleEffect()];
    this.setModelStyle(this.model.style);
  }

  unbindTool(): void {
    unsetViewportEvents(this);
  }

  resetView(): void {
    this.view.viewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1.866025, 1];
  }

  dealloc(): void {
    this.effects.forEach((cleanup) => cleanup());
  }

  setModelStyle(modelStyle: ModelStyle): void {
    if (!modelStyle) {
      return;
    }
    // set initial state using the model style
    this.view.renderStyle = modelStyle.isFoldedForm ? "foldedForm" : "creasePattern";
    this.view.perspective = modelStyle.dimension === 2 ? "orthographic" : "perspective";
    this.view.opacity = modelStyle.transparentFaces ? 0.2 : 1.0;
    // todo: something else to tell it to draw transparent faces
  }

  makeFrameStyleEffect(): () => void {
    return $effect.root(() => {
      $effect(() => this.setModelStyle(this.model.style));
      return () => {
        // empty
      };
    });
  }

  uiEpsilonFactor = 0.01;
  snapRadiusFactor = 0.05;
  // a UI touch event, coming from a pointer device, will have some
  // built-in error correcting (like snapping, for example), and this behavior
  // is zoom-level dependent. Use this variable to get an appropriate error-
  // correcting value.
  //uiEpsilon: number = $derived.by(() => this.view.vmax * settings.uiEpsilonFactor);
  uiEpsilon: number = $derived.by(() => this.view.vmax * this.uiEpsilonFactor);
  snapRadius: number = $derived.by(() => this.view.vmax * this.snapRadiusFactor);
}
