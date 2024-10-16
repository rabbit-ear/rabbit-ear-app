import type { FOLD } from "rabbit-ear/types.js";
import type { Component } from "svelte";
import type { Viewport as ViewportType } from "../viewport.ts";
import ViewportComponent from "./ViewportComponent.svelte";
import app from "../../../app/App.svelte.js";
import { Frame } from "./Frame.svelte.ts";

export class FramesViewport implements ViewportType {
  component: Component;

  redraw?: () => void;

  frames: Frame[] = $derived.by(() => {
    //this.renderings.forEach(obj => obj?.dealloc());
    return (app.file?.framesFlat || []).map((frame, i) => new Frame(frame, i));
  });

  hoverIndex: number;
  pressIndex: number;

  mousemove(index: number): void {
    this.hoverIndex = index;
  }

  mousedown(index: number): void {
    this.pressIndex = index;
  }

  mouseup(index: number): void {
    this.hoverIndex = index;
    if (
      this.pressIndex !== undefined &&
      this.hoverIndex !== undefined &&
      this.pressIndex >= 0 &&
      this.hoverIndex >= 0 &&
      !isNaN(this.hoverIndex) &&
      this.pressIndex !== this.hoverIndex
    ) {
      //app.invoker.executeCommand("moveFrameIndex", pressIndex, hoverIndex);
    }
    this.pressIndex = undefined;
    this.hoverIndex = undefined;
  }

  constructor() {
    this.component = ViewportComponent;
  }

  dealloc(): void {
    // empty
  }
}
