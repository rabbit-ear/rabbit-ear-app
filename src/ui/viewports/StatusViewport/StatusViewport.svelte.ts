import type { Component } from "svelte";
import type { Viewport } from "../Viewport.ts";
import StatusComponent from "./Component.svelte";

export class StatusViewport implements Viewport {
  static name = "Files";

  // the Svelte component to be instanced as one of the App's display canvases
  component: Component = StatusComponent;

  redraw(): void { }
  dealloc(): void { }
}
