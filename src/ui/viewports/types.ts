import type { Component } from "svelte";
// import { ScriptViewport } from "./ScriptViewport/ScriptViewport.svelte.ts";
import { SVGViewport } from "./SVGViewport/SVGViewport.svelte.ts";
// import { TerminalViewport } from "./TerminalViewport/TerminalViewport.svelte.ts";
import { WebGLViewport } from "./WebGLViewport/WebGLViewport.svelte.ts";
import type { FilesViewport } from "./FilesViewport/FilesViewport.svelte.ts";

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

//export interface Deallocable {
//  dealloc(): void;
//}

//export abstract class ViewportStatics {
//  static settings?: object;
//  static panel?: Panel;
//}

//export abstract class IViewport implements Deallocable {
export abstract class IViewport {
  // static properties (unable to be defined here, please define them)
  static name?: string;
  static panel?: Component;

  // an optional panel associated with this viewport.
  panel?: Component;

  // the Svelte component to be instanced as one of the App's display canvases
  component: Component;

  // force the screen to re-calculate window bounds. used when viewports are added/removed
  redraw?: () => void;

  // called when removed from the screen
  dealloc: () => void;
}

//export abstract class GuiViewport implements ViewportEvents, Deallocable {
//export interface IModelViewport extends IViewport, ViewportEvents, Deallocable {
//export abstract class IModelViewport implements IViewport, ViewportEvents, Deallocable {
export abstract class IModelViewport implements IViewport, ViewportEvents {
  // static properties (unable to be defined here, please define them)
  static name?: string;
  static panel?: Component;

  // an optional panel associated with this viewport.
  panel?: Component;

  // the Svelte component to be instanced as one of the App's display canvases
  component: Component;

  // the model to be rendered
  // model?: IModel;
  // move this to the app, where app.getModel() is a getter

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
  unbindTool: () => void;

  // reset the camera to aspect fit the model
  resetView: () => void;

  // called when removed from the screen
  dealloc: () => void;
}

type IViewportConstructor = new (...args: unknown[]) => IViewport;
interface IViewportConstructorWithStatics extends IViewportConstructor {
  panel?: Component;
  name?: string;
}

type IModelViewportConstructor = new (...args: unknown[]) => IModelViewport;
interface IModelViewportConstructorWithStatics extends IModelViewportConstructor {
  panel?: Component;
  name?: string;
}


export type Viewport = SVGViewport | WebGLViewport | FilesViewport;
// | TerminalViewport | ScriptViewport;

// Now restrict ViewportClass to constructors that return an instance of IViewport
//export type ModelViewports = SVGViewport | WebGLViewport | SimulatorViewport;
export type ModelViewport = SVGViewport | WebGLViewport;

// Define the types of the classes
export type ModelViewportType = (typeof SVGViewport | typeof WebGLViewport) &
  IModelViewportConstructorWithStatics;

export type ViewportType = (
  | typeof SVGViewport
  | typeof WebGLViewport
  // | typeof TerminalViewport
  // | typeof ScriptViewport
) &
  IViewportConstructorWithStatics;

// export const ModelViewports = [SVGViewport, WebGLViewport];
// export const Viewports = [SVGViewport, WebGLViewport, ScriptViewport, TerminalViewport];
// export const Viewports = [SVGViewport, WebGLViewport];

export const unsetViewportEvents = (viewport: IModelViewport): void => {
  //console.log("unset viewport events", viewport);
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

