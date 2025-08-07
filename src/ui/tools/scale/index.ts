import type { Component } from "svelte";
import type { Tool } from "../Tool.ts";
import type { Viewport } from "../../viewports/Viewport.ts";
import { SVGViewport } from "../../viewports/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "../../viewports/WebGLViewport/WebGLViewport.svelte.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { SVGViewportState } from "./svg/SVGViewportState.svelte.ts";
import { GLViewportState } from "./GLViewportState.svelte.ts";
import Panel from "./Panel.svelte";
import icon from "./icon.svelte";

class ScaleTool implements Tool {
  static key = "ui.tools.scale";
  static name = "scale";
  static icon = icon;

  state = new GlobalState();
  panel: Component = Panel;

  viewportStates: (SVGViewportState | GLViewportState)[] = [];

  bindTo(viewport: Viewport): () => void {
    if (viewport instanceof SVGViewport) {
      const viewportState = new SVGViewportState(viewport, this.state);
      this.viewportStates.push(viewportState);
      return viewportState.dealloc;
    } else if (viewport instanceof WebGLViewport) {
      const viewportState = new GLViewportState(viewport);
      this.viewportStates.push(viewportState);
      return viewportState.dealloc;
    } else {
      // empty
      return () => { };
    }
  }

  dealloc(): void {
    this.viewportStates.forEach((state) => state.dealloc());
    this.state.dealloc();
  }
}

export default ScaleTool;
