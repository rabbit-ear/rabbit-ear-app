import type { UITool } from "../../UITool.ts";
import type { Viewport } from "../../viewport/viewport.ts";
//import type { Panel } from "../../panel/panel.ts";
import { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "../../viewport/WebGLViewport/WebGLViewport.svelte.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { SVGViewportState } from "./svg/SVGViewportState.svelte.ts";
import { GLViewportState } from "./GLViewportState.svelte.ts";
import { ToolPanel } from "./panel/Panel.svelte.ts";
import icon from "./icon.svelte";

class Tool implements UITool {
  static key = "scale";
  static name = "scale";
  static icon = icon;

  state = new GlobalState();
  panel = new ToolPanel(this.state);

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
    this.panel.dealloc();
  }
}

export default Tool;
