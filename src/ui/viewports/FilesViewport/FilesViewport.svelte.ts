import type { Component } from "svelte";
import type { Viewport } from "../Viewport.ts";
import FilesComponent from "./Component.svelte";

export class FilesViewport implements Viewport {
  static name = "Files";

  // the Svelte component to be instanced as one of the App's display canvases
  component: Component = FilesComponent;

  redraw(): void { }
  dealloc(): void { }
}
