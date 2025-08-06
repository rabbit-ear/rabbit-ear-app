import type { Deallocable } from "../Deallocable.ts";
import type { WebGLViewport } from "../../viewports/WebGLViewport/WebGLViewport.svelte.ts";
import type { ToolEvents } from "../ToolEvents.ts";
import { rotateViewMatrix, zoomViewMatrix } from "../../../general/matrix.ts";

export class WebGLState implements Deallocable, ToolEvents {
  viewport: WebGLViewport;
  previousPoint: [number, number] | undefined;

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
  }

  onmousemove(viewport: Viewport, event: MouseEvent): void {
    //console.log("onmousemove", this, this.viewport);
    event.preventDefault();
    const { point } = event;
    const buttons = this.previousPoint ? 1 : 0;
    if (buttons && this.previousPoint && point) {
      this.viewport.view.viewMatrix = rotateViewMatrix(
        this.viewport.view.perspective,
        this.viewport.view.viewMatrix,
        point,
        this.previousPoint,
      );
      this.previousPoint = point;
    }
  };

  onmousedown(viewport: Viewport, event: MouseEvent): void {
    event.preventDefault();
    const { point } = event;
    this.previousPoint = point;
  };

  onmouseup(viewport: Viewport, _: MouseEvent): void {
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
      this.viewport.view.viewMatrix = zoomViewMatrix(
        this.viewport.view.perspective,
        this.viewport.view.viewMatrix,
        delta,
      );
    }
  };

  dealloc(): void {
    // empty
  }
}

