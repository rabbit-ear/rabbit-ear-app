import type { Component } from "svelte";
import type { Model } from "../../models/Model.ts";
import type { View } from "./View.ts";

export abstract class Viewport {
  // static properties (unable to be defined here, please define them)
  static name?: string;
  static panel?: Component;

  // a (reactive) reference to the model currently being displayed
  abstract model?: Model;

  // rendering information, matrices, scale
  abstract view: View;

  // a unique UUID for each instance
  // this is required for the Svelte {#each} loop to prevent element reuse
  abstract id: string;

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

  // the currently opened FileModel has a few different Model types available
  // for display. must be one of <string>: creasePattern, foldedForm, simulator
  abstract modelName?: string;

  // force the screen to re-calculate window bounds. used when viewports are added/removed
  // abstract redraw?: () => void;

  // called when removed from the screen
  abstract dealloc: () => void;
}

