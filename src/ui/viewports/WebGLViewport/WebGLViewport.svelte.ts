import type { Component } from "svelte";
import type {
  IModelViewport,
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportTouchEvent,
} from "../types.ts";
import { unsetViewportEvents } from "../types.ts";
// import ViewportComponent from "./ViewportComponent.svelte";
// import Dropdown from "./Dropdown.svelte";
// import Panel from "./Panel.svelte";

const settings = {};

export class WebGLViewport implements IModelViewport {
  static settings = settings;
  // static panel: Component = Panel;

  component: Component;
  panel: Component;

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
    // this.component = ViewportComponent;
    // this.panel = Dropdown;
    // this.setModelStyle(this.model.style);
  }

  unbindTool(): void {
    unsetViewportEvents(this);
  }

  resetView(): void {
    // this.view.viewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1.866025, 1];
  }

  dealloc(): void {
    this.effects.forEach((cleanup) => cleanup());
  }

  uiEpsilonFactor = 0.01;
  snapRadiusFactor = 0.05;
  // a UI touch event, coming from a pointer device, will have some
  // built-in error correcting (like snapping, for example), and this behavior
  // is zoom-level dependent. Use this variable to get an appropriate error-
  // correcting value.
  //uiEpsilon: number = $derived.by(() => this.view.vmax * settings.uiEpsilonFactor);
  // uiEpsilon: number = $derived.by(() => this.view.vmax * this.uiEpsilonFactor);
  // snapRadius: number = $derived.by(() => this.view.vmax * this.snapRadiusFactor);
  uiEpsilon: number = 1e-2;
  snapRadius: number = 1e-3;
}

