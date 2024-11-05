import type { UITool } from "../UITool.ts";
import type { Viewport } from "../../viewport/Viewport.ts";
import { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "../../viewport/WebGLViewport/WebGLViewport.svelte.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { SVGViewportState } from "./SVGViewportState.svelte.ts";
import { GLViewportState } from "./GLViewportState.svelte.ts";
import icon from "./icon.svelte";

class Tool implements UITool {
  static key = "line";
  static name = "line";
  static icon = icon;

  state = new GlobalState();
  panel = undefined;

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
      return () => {};
    }
  }

  dealloc(): void {
    this.viewportStates.forEach((state) => state.dealloc());
    this.state.dealloc();
  }
}

export default Tool;
