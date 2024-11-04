import type { Component } from "svelte";

export type ViewportUIEvent = {
  point: [number, number];
};

export type ViewportMouseEvent = MouseEvent & ViewportUIEvent;
export type ViewportTouchEvent = TouchEvent & ViewportUIEvent;
export type ViewportWheelEvent = WheelEvent & ViewportUIEvent;

export interface ViewportEvents {
  // mouse events
  onmousemove?: (event: ViewportMouseEvent) => void;
  onmousedown?: (event: ViewportMouseEvent) => void;
  onmouseup?: (event: ViewportMouseEvent) => void;
  onmouseleave?: (event: ViewportMouseEvent) => void;
  onwheel?: (event: ViewportWheelEvent) => void;
  // touch screen events
  ontouchstart?: (event: ViewportTouchEvent) => void;
  ontouchend?: (event: ViewportTouchEvent) => void;
  ontouchmove?: (event: ViewportTouchEvent) => void;
  ontouchcancel?: (event: ViewportTouchEvent) => void;
  // keyboard events
  onkeydown?: (event: KeyboardEvent) => void;
  onkeyup?: (event: KeyboardEvent) => void;
}

export interface Deallocable {
  dealloc(): void;
}

//export abstract class ViewportStatics {
//  static settings?: object;
//  static panel?: Panel;
//}

export abstract class IViewport implements Deallocable {
  // static properties (unable to be defined here, please define them)
  //static name?: string;
  //static panel?: Component;

  // an optional panel associated with this viewport.
  panel?: Component;

  // the Svelte component to be instanced as one of the App's display canvases
  component: Component;

  // force the screen to re-calculate window bounds. used when viewports are added/removed
  redraw?: () => void;

  // this method will unbind all of the above events (set them to undefined)
  dealloc: () => void;
}

//export abstract class GuiViewport implements ViewportEvents, Deallocable {
//export interface IModelViewport extends IViewport, ViewportEvents, Deallocable {
export abstract class IModelViewport implements IViewport, ViewportEvents, Deallocable {
  // static properties (unable to be defined here, please define them)
  //static name?: string;
  //static panel?: Component;

  // an optional panel associated with this viewport.
  panel?: Component;

  // the Svelte component to be instanced as one of the App's display canvases
  component: Component;

  // force the screen to re-calculate window bounds. used when viewports are added/removed
  redraw?: () => void;

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
}

export const unsetViewportEvents = (viewport: IModelViewport): void => {
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
