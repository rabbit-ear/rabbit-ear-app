import type { UITool } from "../../UITool.ts";
import type { Viewport } from "../../viewport/viewport.ts";
import { GlobalState, ViewportState } from "./state.svelte.ts";
import icon from "./icon.svelte";

class Tool implements UITool {
  static key = "empty";
  static name = "empty";
  static icon = icon;

  state = new GlobalState();
  panel = undefined;

  viewportStates: ViewportState[] = [];

  bindTo(viewport: Viewport): () => void {
    const viewportState = new ViewportState(viewport);
    this.viewportStates.push(viewportState);
    return viewportState.dealloc;
  }

  dealloc(): void {
    this.viewportStates.forEach((state) => state.dealloc());
    this.state.dealloc();
  }
}

export default Tool;
