import type { FOLD } from "rabbit-ear/types.js";
import type { Component } from "svelte";
import { Style } from "./Style.svelte.ts";
import { View } from "./View.svelte.ts";
import FrameComponent from "./FrameComponent.svelte";
//import settings from "./Settings.svelte.ts";

export class Frame {
  //static settings: typeof settings = settings;
  component: Component;

  graph: FOLD;
  index: number;

  style: Style;
  view: View;

  constructor(graph: FOLD, index: number) {
    this.graph = graph;
    this.index = index;
    this.component = FrameComponent;
    this.view = new View(this.graph);
    this.style = new Style(this.view);
  }

  dealloc(): void {
    // empty
  }
}
