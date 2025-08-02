import type { UITool } from "../UITool.ts";
import type { Viewport } from "../../viewports/Viewport.ts";
import { SVGViewport } from "../../viewports/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "../../viewports/WebGLViewport/WebGLViewport.svelte.ts";
import { GlobalState } from "./state/GlobalState.svelte.ts";
import { SVGState } from "./state/SVGState.svelte.ts";
import { WebGLState } from "./state/WebGLState.svelte.ts";
import icon from "./icon.svelte";

class Tool implements UITool {
  static key = "line";
  static name = "line";
  static icon = icon;

  state = new GlobalState();
  panel = undefined;

  viewportStates: (SVGState | WebGLState)[] = [];

  bindTo(viewport: Viewport): () => void {
    if (viewport instanceof SVGViewport) {
      const viewportState = new SVGState(viewport, this.state);
      this.viewportStates.push(viewportState);
      return viewportState.dealloc;
    } else if (viewport instanceof WebGLViewport) {
      const viewportState = new WebGLState(viewport);
      this.viewportStates.push(viewportState);
      return viewportState.dealloc;
    } else {
      return () => { };
    }
  }

  dealloc(): void {
    this.viewportStates.forEach((state) => state.dealloc());
    this.state.dealloc();
  }
}

export default Tool;
