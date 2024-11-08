import type { UITool } from "../../tools/UITool.ts";
import type { IViewport } from "../../viewport/ViewportTypes.ts";
import { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "../../viewport/WebGLViewport/WebGLViewport.svelte.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { SVGViewportState } from "./SVGViewportState.svelte.ts";
import { GLViewportState } from "./GLViewportState.svelte.ts";
import icon from "./icon.svelte";

class Tool implements UITool {
  static key = "circle";
  static name = "circle";
  static icon = icon;

  state = new GlobalState();
  panel = undefined;

  viewportStates: (SVGViewportState | GLViewportState)[] = [];

  bindTo(viewport: IViewport): () => void {
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
