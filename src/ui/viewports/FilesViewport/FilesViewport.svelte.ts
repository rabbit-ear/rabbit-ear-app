import type { Component } from "svelte";
import type { IViewport } from "../types";
import FilesComponent from "./Component.svelte";

export class FilesViewport implements IViewport {
  static name = "Files";

  // the Svelte component to be instanced as one of the App's display canvases
  component: Component = FilesComponent;

  redraw(): void { }
  dealloc(): void { }
}
