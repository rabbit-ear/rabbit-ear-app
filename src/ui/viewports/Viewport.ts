import type { Component } from "svelte";

export abstract class Viewport {
  // static properties (unable to be defined here, please define them)
  static name?: string;
  static panel?: Component;

  // an optional panel associated with this viewport.
  abstract panel?: Component;

  // the Svelte component to be instanced as one of the App's display canvases
  abstract component: Component;

  // the DOMElement, on which we will do things like bind touch event handlers
  abstract domElement?: Element;

  // an optional callback, after this fires, domElement will be accessible
  abstract didMount?: () => void;

  // force the screen to re-calculate window bounds. used when viewports are added/removed
  // abstract redraw?: () => void;

  // called when removed from the screen
  abstract dealloc: () => void;
}

// export abstract class ModelViewport extends Viewport {
//
// }

