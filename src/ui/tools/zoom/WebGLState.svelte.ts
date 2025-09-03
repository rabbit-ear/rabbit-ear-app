import type { Viewport } from "../../viewports/Viewport.ts";
import type { WebGLViewport } from "../../viewports/WebGLViewport/WebGLViewport.svelte.ts";
import type { ToolEvents } from "../ToolEvents.ts";
import {
  rotateViewMatrix,
  vectorFromScreenLocation,
  zoomViewMatrix,
} from "../../../general/matrix.ts";

export class WebGLState implements ToolEvents {
  viewport: WebGLViewport;
  previousPoint: [number, number] | undefined;

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
  }

  onmousemove(viewport: Viewport, event: MouseEvent): void {
    event.preventDefault();
    const point = vectorFromScreenLocation(
      [event.offsetX, event.offsetY],
      viewport.view.canvasSize,
      viewport.view.projection,
    );

    const buttons = this.previousPoint ? 1 : 0;
    if (buttons && this.previousPoint && point) {
      viewport.view.view = rotateViewMatrix(
        viewport.view.perspective,
        viewport.view.view,
        point,
        this.previousPoint,
      );
      this.previousPoint = point;
    }
  };

  onmousedown(viewport: Viewport, event: MouseEvent): void {
    event.preventDefault();
    const point = vectorFromScreenLocation(
      [event.offsetX, event.offsetY],
      viewport.view.canvasSize,
      viewport.view.projection,
    );
    this.previousPoint = point;
  };

  onmouseup(viewport: Viewport, _: MouseEvent): void {
    this.previousPoint = undefined;
  };

  onwheel(viewport: Viewport, event: WheelEvent): void {
    const { deltaY } = event;
    if (deltaY !== undefined) {
      const delta = -deltaY * (viewport.constructor as WebGLViewport).settings.scrollSensitivity;
      if (Math.abs(delta) < 1e-3) { return; }
      viewport.view.view = zoomViewMatrix(
        viewport.view.perspective,
        viewport.view.view,
        delta,
      );
    }
  };

  dealloc(): void {
    // empty
  }
}

