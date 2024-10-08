import type { Component } from "svelte";
import type {
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportTouchEvent,
  ViewportEvents,
} from "./events.ts";

export interface Deallocable {
  dealloc(): void;
}

// an abstract class would allow us to describe the "settings" static property.
//export abstract class Viewport implements ViewportEvents, Deallocable {
export interface Viewport extends ViewportEvents, Deallocable {
  // the Svelte component to be instanced as one of the App's display canvases
  component: Component;

  // force the screen to re-calculate window bounds. used when viewports are added/removed
  redraw?: () => void;

  // to be implemented by each component:
  // static settings: any;

  // all events are optional
  onmousemove?: ((e: ViewportMouseEvent) => void) | undefined;
  onmousedown?: ((e: ViewportMouseEvent) => void) | undefined;
  onmouseup?: ((e: ViewportMouseEvent) => void) | undefined;
  onmouseleave?: ((e: ViewportMouseEvent) => void) | undefined;
  onwheel?: ((e: ViewportWheelEvent) => void) | undefined;
  ontouchstart?: ((e: ViewportTouchEvent) => void) | undefined;
  ontouchend?: ((e: ViewportTouchEvent) => void) | undefined;
  ontouchmove?: ((e: ViewportTouchEvent) => void) | undefined;
  ontouchcancel?: ((e: ViewportTouchEvent) => void) | undefined;
  onkeydown?: ((event: KeyboardEvent) => void) | undefined;
  onkeyup?: ((event: KeyboardEvent) => void) | undefined;

  // this method will unbind all of the above events (set them to undefined)
  dealloc: () => void;

  // a UI touch event, coming from a pointer device, will have some
  // built-in error correcting (like snapping, for example), and this behavior
  // is zoom-level dependent. Use this variable to get an appropriate error-
  // correcting value.
  uiEpsilon: number;
}

export const unsetViewportEvents = (viewport: Viewport): void => {
  viewport.onmousemove = undefined;
  viewport.onmousedown = undefined;
  viewport.onmouseup = undefined;
  viewport.onmouseleave = undefined;
  viewport.onwheel = undefined;
  viewport.ontouchstart = undefined;
  viewport.ontouchend = undefined;
  viewport.ontouchmove = undefined;
  viewport.ontouchcancel = undefined;
  viewport.onkeydown = undefined;
  viewport.onkeyup = undefined;
};
