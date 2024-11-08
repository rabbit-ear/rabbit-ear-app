import type { Component } from "svelte";
import type { IViewport } from "../ViewportTypes.ts";
import FramesViewportComponent from "./FramesViewportComponent.svelte";
import app from "../../../app/App.svelte.js";
import { Frame } from "./Frame.svelte.ts";
import FramesPanel from "./Panel.svelte";

export class FramesViewport implements IViewport {
  static panel: Component = FramesPanel;

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
      app.invoker.executeMethod("moveFrameIndex", this.pressIndex, this.hoverIndex);
    }
    this.pressIndex = undefined;
    this.hoverIndex = undefined;
  }

  constructor() {
    this.component = FramesViewportComponent;
  }

  dealloc(): void {
    // empty
  }
}