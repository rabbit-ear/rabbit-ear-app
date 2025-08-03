import type { Deallocable } from "../../Deallocable.ts";
import type { Viewport } from "../../../viewports/Viewport.ts";
import type { WebGLViewport } from "../../../viewports/WebGLViewport/WebGLViewport.svelte.ts";
import type { ToolEvents } from "../../ToolEvents.ts";

export class WebGLState implements Deallocable, ToolEvents {
  viewport: WebGLViewport;

  previousPoint: [number, number] | undefined;

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
  }

  onmousemove(viewport: Viewport, event: MouseEvent): void {
    //console.log("onmousemove", this, this.viewport);
    event.preventDefault();
    // const { point } = event;
  };

  onmousedown(viewport: Viewport, event: MouseEvent): void {
    event.preventDefault();
    const { x, y } = event;
    this.previousPoint = [x, y];
  };

  onmouseup(viewport: Viewport, event: MouseEvent): void {
    this.previousPoint = undefined;
  };

  onwheel(viewport: Viewport, event: WheelEvent): void {
    const { deltaY } = event;
    if (deltaY !== undefined) {
      const scrollSensitivity = 1 / 100;
      const delta = -deltaY * scrollSensitivity;
      if (Math.abs(delta) < 1e-3) {
        return;
      }
    }
  };

  dealloc(): void {
    // empty
  }
}
