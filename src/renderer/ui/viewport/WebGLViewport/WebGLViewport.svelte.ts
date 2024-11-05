import type { Component } from "svelte";
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
import settings from "./Settings/ClassSettings.svelte.ts";
import { View } from "./Settings/View.svelte.ts";

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

  // layer?: unknown = $state();
  // props?: unknown = $state();

  constructor() {
    this.component = ViewportComponent;
    this.panel = Dropdown;
    this.view = new View();
    //this.style = new Style(this.view);
  }

  dealloc(): void {
    unsetViewportEvents(this);
    // todo
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
