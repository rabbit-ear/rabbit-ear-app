import type { Viewport } from "../../viewports/Viewport.ts";
import type { SVGViewport } from "../../viewports/SVGViewport/SVGViewport.svelte.ts";
import type { ToolEvents } from "../ToolEvents.ts";
import { magnitude2, subtract2 } from "rabbit-ear/math/vector.js";
import { wheelEventZoomMatrix, wheelPanMatrix, panCameraMatrix } from "./matrix.ts";
import { getSVGViewportPoint } from "../../viewports/SVGViewport/touches.ts";
import context from "../../../app/context.svelte.ts";

export class SVGState implements ToolEvents {
  viewport: SVGViewport;
  press: [number, number] | undefined = $state();
  move: [number, number] | undefined = $state();
  drag: [number, number] | undefined = $state();
  dragVector: [number, number] = $state([0, 0]);

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
  }

  onmousemove(viewport: Viewport, { offsetX, offsetY, buttons }: MouseEvent): void {
    // we have 2 ways of accomplishing this:
    // - make small incremental changes given the relative movement each frame,
    // - capture starting state, re-calculate absolute change from starting state
    // the second, we can't base the "drag vector" on a viewport-point
    // because the viewport is constantly changing underneath us, rather,
    // we need to base it off of the unchanging offsetX and offsetY.
    // This is currently implementing the first approach.
    const point = getSVGViewportPoint(viewport, [offsetX, offsetY]);
    this.move = buttons ? undefined : point;
    this.drag = buttons ? point : undefined;
    this.dragVector =
      !this.drag || !this.press
        ? [0, 0]
        : subtract2(this.drag, this.press);

    if (this.drag && this.press && magnitude2(this.dragVector) > 0.01) {
      const model = this.viewport.view.model;
      const translation: [number, number] = [
        this.dragVector[0] * (1 / model[0]),
        this.dragVector[1] * (1 / model[3]) * (this.viewport.view.rightHanded ? -1 : 1),
      ];
      this.viewport.view.camera = panCameraMatrix(this.viewport.view.camera, translation);
    }
  };

  onmousedown(viewport: Viewport, { offsetX, offsetY, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [offsetX, offsetY]);
    this.move = buttons ? undefined : point;
    this.drag = buttons ? point : undefined;
    this.press = point;
    this.dragVector = [0, 0];
  };

  onmouseup(viewport: Viewport, { offsetX, offsetY, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [offsetX, offsetY]);
    this.move = buttons ? undefined : point;
    this.drag = buttons ? point : undefined;
    this.dragVector = [0, 0];
    this.reset();
  };

  // onmouseleave = (event: ViewportMouseEvent) => {
  // 	this.tool.reset();
  // };

  onwheel(viewport: Viewport, { offsetX, offsetY, deltaX, deltaY }: WheelEvent): void {
    const point = getSVGViewportPoint(viewport, [offsetX, offsetY]);
    return context.keyboardManager.command || context.keyboardManager.control
      ? wheelPanMatrix(this.viewport, { deltaX, deltaY })
      : wheelEventZoomMatrix(this.viewport, { point, deltaY });
  };

  reset(): void {
    this.move = undefined;
    this.drag = undefined;
    this.press = undefined;
    this.dragVector = [0, 0];
  }

  dealloc(): void {
    this.reset();
  }
}

