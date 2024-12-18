import type { UITool } from "../UITool.ts";
import type { IModelViewport } from "../../viewport/ViewportTypes.ts";
import { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "../../viewport/WebGLViewport/WebGLViewport.svelte.ts";
import { GlobalState } from "./state/GlobalState.svelte.ts";
import { SVGState } from "./state/SVGState.svelte.ts";
import { WebGLState } from "./state/WebGLState.svelte.ts";
import icon from "./icon.svelte";

class Tool implements UITool {
  static key = "select";
  static name = "select";
  static icon = icon;

  state = new GlobalState();
  panel = undefined;

  viewportStates: (SVGState | WebGLState)[] = [];

  bindTo(viewport: IModelViewport): () => void {
    if (viewport instanceof SVGViewport) {
      const viewportState = new SVGState(viewport, this.state);
      this.viewportStates.push(viewportState);
      return viewportState.dealloc;
    } else if (viewport instanceof WebGLViewport) {
      const viewportState = new WebGLState(viewport);
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
