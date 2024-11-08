import type { UITool } from "../../tools/UITool.ts";
import type { IViewport } from "../../viewport/ViewportTypes.ts";
import { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "../../viewport/WebGLViewport/WebGLViewport.svelte.ts";
import { SimulatorViewport } from "../../viewport/SimulatorViewport/SimulatorViewport.svelte.ts";
import { SVGState } from "./state/SVGState.svelte.ts";
import { WebGLState } from "./state/WebGLState.svelte.ts";
import { SimulatorState } from "./state/SimulatorState.svelte.ts";
import icon from "./icon.svelte";

class Tool implements UITool {
  static key = "zoom";
  static name = "zoom";
  static icon = icon;

  panel = undefined;

  viewportStates: (SVGState | WebGLState | SimulatorState)[] = [];

  bindTo(viewport: IViewport): () => void {
    if (viewport instanceof SVGViewport) {
      const viewportState = new SVGState(viewport);
      this.viewportStates.push(viewportState);
      return viewportState.dealloc;
    } else if (viewport instanceof WebGLViewport) {
      const viewportState = new WebGLState(viewport);
      this.viewportStates.push(viewportState);
      return viewportState.dealloc;
    } else if (viewport instanceof SimulatorViewport) {
      const viewportState = new SimulatorState(viewport);
      this.viewportStates.push(viewportState);
      return viewportState.dealloc;
    } else {
      return () => {};
    }
  }

  dealloc(): void {
    this.viewportStates.forEach((state) => state.dealloc());
  }
}

export default Tool;
