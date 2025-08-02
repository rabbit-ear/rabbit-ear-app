import type { Viewport } from "../viewports/Viewport.ts";

export abstract class ToolEvents {
  abstract onmousemove?: (viewport: Viewport, event: MouseEvent) => void;
  abstract onmousedown?: (viewport: Viewport, event: MouseEvent) => void;
  abstract onmouseup?: (viewport: Viewport, event: MouseEvent) => void;
  abstract onmouseleave?: (viewport: Viewport, event: MouseEvent) => void;
  abstract onwheel?: (viewport: Viewport, event: WheelEvent) => void;
  // touch screen events
  abstract ontouchstart?: (viewport: Viewport, event: TouchEvent) => void;
  abstract ontouchend?: (viewport: Viewport, event: TouchEvent) => void;
  abstract ontouchmove?: (viewport: Viewport, event: TouchEvent) => void;
  abstract ontouchcancel?: (viewport: Viewport, event: TouchEvent) => void;
  // keyboard events
  abstract onkeydown?: (viewport: Viewport, event: KeyboardEvent) => void;
  abstract onkeyup?: (viewport: Viewport, event: KeyboardEvent) => void;
}
