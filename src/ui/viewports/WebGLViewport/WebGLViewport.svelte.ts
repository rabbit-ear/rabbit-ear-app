import type { Component } from "svelte";
import type { Viewport } from "../Viewport";
import type { FrameAttributes } from "../../../models/FrameAttributes.ts";
import ViewportComponent from "./ViewportComponent.svelte";
// import Dropdown from "./Dropdown.svelte";
// import ClassPanel from "./Panel.svelte";
import { View } from "./View.svelte.ts";
import type { ViewportState } from "../ViewportState.svelte.ts";
// import { Settings } from "./Settings.svelte.ts";

//class Style {
//  view: View;
//  constructor(view: View) {
//    this.view = view;
//  }
//}

export class WebGLViewport implements Viewport {
  static name: string = "WebGL Viewport";
  // static settings: Settings = new Settings();
  // static panel: Component = ClassPanel;

  state: ViewportState;

  id: string;
  component: Component;
  // dropdown: Component;
  domElement?: SVGSVGElement;
  didMount?: () => void;

  view: View;
  //style: Style;

  // model?: Model = $state.raw();
  modelName = $state("cp");

  // layer?: unknown = $state();
  // props?: unknown = $state();

  redraw?: () => void = $state();

  effects: (() => void)[];

  constructor(state: ViewportState) {
    this.id = String(Math.random());
    this.state = state;
    this.component = ViewportComponent;
    // this.dropdown = Dropdown;
    this.view = new View();
    //this.style = new Style(this.view);
    this.effects = [this.makeFrameAttributesEffect()];
    // this.setModelStyle(this.model.style);
  }

  setModelStyle(modelStyle: FrameAttributes): void {
    if (!modelStyle) {
      return;
    }
    // set initial state using the model style
    this.view.renderStyle = modelStyle.isFoldedForm ? "foldedForm" : "creasePattern";
    this.view.perspective = modelStyle.dimension === 2 ? "orthographic" : "perspective";
    this.view.opacity = modelStyle.transparentFaces ? 0.2 : 1.0;
    // todo: something else to tell it to draw transparent faces
  }

  makeFrameAttributesEffect(): () => void {
    return $effect.root(() => {
      $effect(() => this.setModelStyle(this.model.attributes));
      return () => {
        // empty
      };
    });
  }

  resetView(): void {
    this.view.viewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1.866025, 1];
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

