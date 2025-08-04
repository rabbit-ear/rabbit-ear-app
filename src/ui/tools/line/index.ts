import type { Tool } from "../Tool.ts";
import type { Viewport } from "../../viewports/Viewport.ts";
import { SVGViewport } from "../../viewports/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "../../viewports/WebGLViewport/WebGLViewport.svelte.ts";
import { GlobalState } from "./state/GlobalState.svelte.ts";
import { SVGState } from "./state/SVGState.svelte.ts";
import { WebGLState } from "./state/WebGLState.svelte.ts";
import icon from "./icon.svelte";

class LineTool implements Tool {
  static key = "line";
  static name = "line";
  static icon = icon;

  state = new GlobalState();
  panel = undefined;

  states = new Map<Viewport, (SVGState | WebGLState)>();

  private makeViewportState(viewport: Viewport) {
    if (viewport instanceof SVGViewport) {
      return new SVGState(viewport, this.state);
    } else if (viewport instanceof WebGLViewport) {
      return new WebGLState(viewport);
    }
    return undefined;
  }

  bindTo(viewport: Viewport): () => void {
    const viewportState = this.makeViewportState(viewport);
    if (!viewportState) { return () => { }; }
    this.states.set(viewport, viewportState);
    return () => viewportState.dealloc?.();
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
    console.log("LineTool dealloc()");
    this.states.forEach(state => state.dealloc());
    this.state.dealloc();
  }
}

export default LineTool;
