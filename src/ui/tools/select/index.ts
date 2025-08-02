import type { Tool } from "../Tool.ts";
import type { Viewport } from "../../viewports/Viewport.ts";
import { SVGViewport } from "../../viewports/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "../../viewports/WebGLViewport/WebGLViewport.svelte.ts";
import { GlobalState } from "./state/GlobalState.svelte.ts";
import { SVGState } from "./state/SVGState.svelte.ts";
import { WebGLState } from "./state/WebGLState.svelte.ts";
import icon from "./icon.svelte";

class SelectTool implements Tool {
  static key = "select";
  static name = "select";
  static icon = icon;

  state = new GlobalState();
  panel = undefined;

  states = new Map<Viewport, (SVGState | WebGLState)>();

  viewportStates: (SVGState | WebGLState)[] = [];

  bindTo(viewport: Viewport): () => void {
    if (viewport instanceof SVGViewport) {
      const viewportState = new SVGState(viewport, this.state);
      this.states.set(viewport, viewportState);
      // this.viewportStates.push(viewportState);
      return viewportState.dealloc;
    } else if (viewport instanceof WebGLViewport) {
      const viewportState = new WebGLState(viewport);
      this.viewportStates.push(viewportState);
      return viewportState.dealloc;
    } else {
      return () => { };
    }
  }

  onmousemove(viewport: Viewport, event: MouseEvent): void {
    this.states.get(viewport)?.onmousemove?.(viewport, event);
  }

  onmousedown(viewport: Viewport, event: MouseEvent): void {
    this.states.get(viewport)?.onmousedown?.(viewport, event);
  }

  onmouseup(viewport: Viewport, event: MouseEvent): void {
    this.states.get(viewport)?.onmouseup?.(viewport, event);
  }

  onmouseleave(viewport: Viewport, event: MouseEvent): void {
    this.states.get(viewport)?.onmouseleave?.(viewport, event);
  }

  onwheel(viewport: Viewport, event: MouseEvent): void {
    this.states.get(viewport)?.onwheel?.(viewport, event);
  }

  // // touch screen events
  // ontouchstart?: (viewport: Viewport, event: TouchEvent) => void;
  // ontouchend?: (viewport: Viewport, event: TouchEvent) => void;
  // ontouchmove?: (viewport: Viewport, event: TouchEvent) => void;
  // ontouchcancel?: (viewport: Viewport, event: TouchEvent) => void;
  // // keyboard events
  // onkeydown?: (viewport: Viewport, event: KeyboardEvent) => void;
  // onkeyup?: (viewport: Viewport, event: KeyboardEvent) => void;

  dealloc(): void {
    this.viewportStates.forEach((state) => state.dealloc());
    this.state.dealloc();
  }
}

export default SelectTool;
