import type { UITool } from "../../UITool.ts";
import { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "../../viewport/WebGLViewport/WebGLViewport.svelte.ts";
import type { Viewport } from "../../viewport/viewport.ts";
import { SVGViewportState, GLViewportState } from "./state.svelte.ts";
import icon from "./icon.svelte";

class Tool implements UITool {
  static key = "zoom";
  static name = "zoom";
  static icon = icon;

  panel = undefined;

  viewportStates: (SVGViewportState | GLViewportState)[] = [];

  bindTo(viewport: Viewport): Function {
    if (viewport instanceof SVGViewport) {
      const viewportState = new SVGViewportState(viewport);
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
  }
}

export default Tool;
