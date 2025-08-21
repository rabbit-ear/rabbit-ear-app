import type { Tool } from "../Tool.ts";
import type { Viewport } from "../../viewports/Viewport.ts";
import { SVGViewport } from "../../viewports/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "../../viewports/WebGLViewport/WebGLViewport.svelte.ts";
import { GlobalState } from "./state/GlobalState.svelte.ts";
import { SVGState } from "./state/SVGState.svelte.ts";
import { WebGLState } from "./state/WebGLState.svelte.ts";
import icon from "./icon.svelte";
import { UIMode } from "../../Settings.svelte.ts";

class SelectTool implements Tool {
  static key = "ui.tools.select";
  static name = "select";
  static icon = icon;
  static modes = [UIMode.mesh, UIMode.ruler];

  state = new GlobalState();
  panel = undefined;

  states = new Map<Viewport, (SVGState | WebGLState)>();

  private viewportState(viewport: Viewport) {
    if (viewport instanceof SVGViewport) {
      return new SVGState(viewport, this.state);
    } else if (viewport instanceof WebGLViewport) {
      return new WebGLState(viewport);
    }
    return undefined;
  }

  bindTo(viewport: Viewport): () => void {
    const state = this.viewportState(viewport);
    if (!state) { return () => { }; }
    this.states.set(viewport, state);
    return () => state.dealloc?.();
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

  onwheel(viewport: Viewport, event: WheelEvent): void {
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
    this.states.forEach(state => state.dealloc());
    this.state.dealloc();
  }
}

export default SelectTool;
