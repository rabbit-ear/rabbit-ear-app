import type { Component } from "svelte";
import type { Embedding } from "../../graphs/Embedding.ts";
import type { View } from "./View.ts";

export abstract class Viewport {
  // static properties (unable to be defined here, please define them)
  static name?: string;
  static panel?: Component;

  // a (reactive) reference to the graph embedding currently being displayed
  abstract embedding?: Embedding;

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
  // NOTE: this is being used by the ViewportManager. Do not implement!
  abstract didMount?: () => void;

  // the currently opened file has a few different embeddings available
  // for display. must be one of <string>: creasePattern, foldedForm, simulator
  abstract embeddingName?: string;

  // force the screen to re-calculate window bounds. used when viewports are added/removed
  // this is currently used (and necessary) in the WebGL but not SVG viewports.
  abstract redraw?: () => void;

  // called when removed from the screen
  abstract dealloc: () => void;
}

