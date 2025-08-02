import type { Component } from "svelte";
// import { ScriptViewport } from "./ScriptViewport/ScriptViewport.svelte.ts";
import { SVGViewport } from "./SVGViewport/SVGViewport.svelte.ts";
// import { TerminalViewport } from "./TerminalViewport/TerminalViewport.svelte.ts";
import { WebGLViewport } from "./WebGLViewport/WebGLViewport.svelte.ts";
import type { FilesViewport } from "./FilesViewport/FilesViewport.svelte.ts";

export abstract class Viewport {
  // static properties (unable to be defined here, please define them)
  static name?: string;
  static panel?: Component;

  // an optional panel associated with this viewport.
  abstract panel?: Component;

  // the Svelte component to be instanced as one of the App's display canvases
  abstract component: Component;

  //
  abstract domElement?: Element;

  // force the screen to re-calculate window bounds. used when viewports are added/removed
  // abstract redraw?: () => void;

  // called when removed from the screen
  abstract dealloc: () => void;
}

// export abstract class ModelViewport extends Viewport {
//
// }

