import type { Component } from "svelte";
import type { Viewport } from "../viewport.ts";
import type {
  ViewportEvents,
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportTouchEvent,
} from "../events.ts";
import { unsetViewportEvents } from "../viewport.ts";
import ViewportComponent from "./Viewport.svelte";
import settings from "./Settings.svelte.ts";

export class TerminalViewport implements Viewport, ViewportEvents {
  component: Component;

  redraw?: () => void;

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

  static settings: typeof settings = settings;

  layer?: Component = $state();
  props?: object = $state();

  constructor() {
    this.component = ViewportComponent;
  }

  dealloc(): void {
    unsetViewportEvents(this);
    this.layer = undefined;
    this.props = undefined;
  }
}
