import type { Component } from "svelte";
import type { ViewportState } from "../../app/ViewportState.svelte";

export abstract class Viewport {
  // static properties (unable to be defined here, please define them)
  static name?: string;
  static panel?: Component;

  // abstract constructor(state: ViewportState);

  // a unique UUID for each instance
  // this is required for the Svelte {#each} loop to prevent element reuse
  abstract id: string;

  abstract state: ViewportState;

  // an optional panel associated with this viewport.
  abstract panel?: Component;

  // an optional panel placed inside the viewport, under a dropdown menu
  abstract dropdown?: Component;

  // the Svelte component to be instanced as one of the App's display canvases
  abstract component: Component;

  // the DOMElement, on which we will do things like bind touch event handlers
  abstract domElement?: Element;

  // an optional callback, this will fire after the component has mounted.
  // when this triggers, you are now able to access domElement
  abstract didMount?: () => void;

  // cp, folded, simulator
  abstract modelName?: string;

  // force the screen to re-calculate window bounds. used when viewports are added/removed
  // abstract redraw?: () => void;

  // called when removed from the screen
  abstract dealloc: () => void;
}

