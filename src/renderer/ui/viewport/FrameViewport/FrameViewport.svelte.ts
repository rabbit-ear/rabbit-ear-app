import type { Component } from "svelte";
import type { Viewport } from "../viewport.ts";
import ViewportComponent from "./Viewport.svelte";

export class FrameViewport implements Viewport {
  component: Component;

  redraw?: () => void;

  constructor() {
    this.component = ViewportComponent;
  }

  dealloc(): void {
    // empty
  }
}
