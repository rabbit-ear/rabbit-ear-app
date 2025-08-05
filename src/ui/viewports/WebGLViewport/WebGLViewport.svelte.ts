import type { Component } from "svelte";
import type { Viewport } from "../Viewport";
// import ViewportComponent from "./ViewportComponent.svelte";
// import Dropdown from "./Dropdown.svelte";
// import Panel from "./Panel.svelte";

const settings = {};

export class WebGLViewport implements Viewport {
  static settings = settings;
  // static panel: Component = Panel;

  id: string;

  component: Component;
  panel: Component;

  redraw?: () => void = $state();

  // layer?: unknown = $state();
  // props?: unknown = $state();

  constructor() {
    this.id = String(Math.random());
    // this.component = ViewportComponent;
    // this.panel = Dropdown;
    // this.setModelStyle(this.model.style);
  }

  unbindTool(): void {
  }

  resetView(): void {
    // this.view.viewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1.866025, 1];
  }

  dealloc(): void {
    // this.effects.forEach((cleanup) => cleanup());
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

