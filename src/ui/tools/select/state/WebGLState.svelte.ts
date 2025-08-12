import { type Box } from "rabbit-ear/types.js";
import { boundingBox } from "rabbit-ear/math/polygon.js";
import type { Deallocable } from "../../Deallocable.ts";
import type { Viewport } from "../../../viewports/Viewport.ts";
import type { ToolEvents } from "../../ToolEvents.ts";
import type { WebGLViewport } from "../../../viewports/WebGLViewport/WebGLViewport.svelte.ts";
import { Touches } from "./Touches.svelte.ts";
import { vectorFromScreenLocation, zoomViewMatrix } from "../../../../general/matrix.ts";

export class WebGLState implements Deallocable, ToolEvents {
  viewport: WebGLViewport;
  touches: Touches;

  previousPoint: [number, number] | undefined;

  box: Box | undefined = $derived.by(() => {
    if (!this.touches.press || !this.touches.drag) {
      return undefined;
    }
    const points = [
      $state.snapshot(this.touches.press),
      $state.snapshot(this.touches.drag),
    ];
    return boundingBox(points);
  });

  rect: { x: number; y: number; width: number; height: number } | undefined = $derived(
    this.box && this.box.span
      ? {
        x: this.box.min[0],
        y: this.box.min[1],
        width: this.box.span[0],
        height: this.box.span[1],
      }
      : undefined,
  );

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.touches = new Touches(this.viewport);
  }

  onmousemove(viewport: Viewport, event: MouseEvent): void {
    //console.log("onmousemove", this, this.viewport);
    event.preventDefault();
    const { buttons } = event;
    const point = vectorFromScreenLocation(
      [event.clientX, event.clientY],
      // [event.offsetX, event.offsetY],
      viewport.view.canvasSize,
      viewport.view.projection,
    );
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
  };

  onmousedown(viewport: Viewport, event: MouseEvent): void {
    event.preventDefault();
    const { x, y } = event;
    this.previousPoint = [x, y];
    this.previousPoint = vectorFromScreenLocation(
      [event.clientX, event.clientY],
      // [event.offsetX, event.offsetY],
      viewport.view.canvasSize,
      viewport.view.projection,
    );
  };

  onmouseup(viewport: Viewport, event: MouseEvent): void {
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
