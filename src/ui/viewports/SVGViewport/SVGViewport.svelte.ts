import type { Component } from "svelte";
import type { Viewport } from "../Viewport.ts";
import { unsetViewportEvents } from "../types.ts";
// import ViewportPanel from "./Dropdown.svelte";
// import ClassPanel from "./Panel.svelte";
import ViewportComponent from "./Component.svelte";
import Settings from "./Settings.svelte.ts";

export class SVGViewport implements Viewport {
  static name: string = "SVG Viewport";
  static settings: Settings = new Settings();
  // static panel: Component = ClassPanel;
  //static panel: Panel = new ClassPanel();

  component: Component;
  panel: Component;

  domElement?: SVGSVGElement;

  // when this triggers, you are now able to access domElement
  didMount?: () => void;

  // get domElement(): Element { return this.component.element; } 

  // the SVG Viewport comes with the ability to instantiate a <g> layer.
  // currently, this is used by the tools to draw indicator marks.
  layer?: Component = $state();
  //props?: object & SVGAttributes<SVGGElement> = $state();
  props?: object = $state();

  // a UI touch event, coming from a pointer device, will have some
  // built-in error correcting (like snapping, for example), and this behavior
  // is zoom-level dependent. Use this variable to get an appropriate error-
  // correcting value.
  // uiEpsilon: number = $derived.by(() => this.view.vmax * settings.uiEpsilonFactor);
  uiEpsilon: number = 1e-2;

  redraw?: () => void = $state();

  // todo: somehow we need to be able to swap viewports (WebGL to SVG)
  // and carry over the style settings (view and render style).
  constructor() {
    this.component = ViewportComponent;
    // this.panel = ViewportPanel;
  }

  // onmousemove(e: MouseEvent) { context.ui?.toolManager.getTool()?.onmousemove?.(this, e); }
  // onmousedown(e: MouseEvent) { context.ui?.toolManager.getTool()?.onmousedown?.(this, e); }
  // onmouseup(e: MouseEvent) { context.ui?.toolManager.getTool()?.onmouseup?.(this, e); }
  // onmouseleave(e: MouseEvent) { context.ui?.toolManager.getTool()?.onmouseleave?.(this, e); }
  // onwheel(e: WheelEvent) { context.ui?.toolManager.getTool()?.onwheel?.(this, e); }
  // ontouchstart(e: TouchEvent) { context.ui?.toolManager.getTool()?.ontouchstart?.(this, e); }
  // ontouchend(e: TouchEvent) { context.ui?.toolManager.getTool()?.ontouchend?.(this, e); }
  // ontouchmove(e: TouchEvent) { context.ui?.toolManager.getTool()?.ontouchmove?.(this, e); }
  // ontouchcancel(e: TouchEvent) { context.ui?.toolManager.getTool()?.ontouchcancel?.(this, e); }
  // onkeydown(e: KeyboardEvent) { context.ui?.toolManager.getTool()?.onkeydown?.(this, e); }
  // onkeyup(e: KeyboardEvent) { context.ui?.toolManager.getTool()?.onkeyup?.(this, e); }

  unbindTool(): void {
    unsetViewportEvents(this);
    this.layer = undefined;
    this.props = undefined;
  }

  resetView(): void {
  }

  dealloc(): void {
    // empty
  }
}

