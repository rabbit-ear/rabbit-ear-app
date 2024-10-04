import type { UITool } from "../../UITool.ts";
import type { Viewport } from "../../viewport/viewport.ts";
import { SVGViewport } from "../../viewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "../../viewport/WebGLViewport.svelte.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { SVGViewportState } from "./SVGViewportState.svelte.ts";
import { GLViewportState } from "./GLViewportState.svelte.ts";
import icon from "./icon.svelte";

class Tool implements UITool {
  static key = "select";
  static name = "select";
  static icon = icon;

  state = new GlobalState();
  panel = undefined;

  viewportStates: (SVGViewportState | GLViewportState)[] = [];

  bindTo(viewport: Viewport): Function {
    if (viewport instanceof SVGViewport) {
      const viewportState = new SVGViewportState(viewport, this.state);
      this.viewportStates.push(viewportState);
      return viewportState.dealloc;
    } else if (viewport instanceof WebGLViewport) {
      const viewportState = new GLViewportState(viewport);
      this.viewportStates.push(viewportState);
      return viewportState.dealloc;
    } else {
      return () => { };
    }
  }

  dealloc() {
    this.viewportStates.forEach((state) => state.dealloc());
    this.state.dealloc();
  }
}

export default Tool;
