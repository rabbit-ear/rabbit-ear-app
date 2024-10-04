import type {
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportEvents,
} from "../../viewport/events.ts";
import type { SVGViewport } from "../../viewport/SVGViewport.svelte.ts";
import { wheelEventZoomMatrix } from "../zoom/matrix.ts";
import { SVGTouches } from "./SVGTouches.svelte.ts";

export class SVGViewportEvents implements ViewportEvents {
  touches: SVGTouches;
  viewport: SVGViewport;

  onmousemove = ({ point, buttons }: ViewportMouseEvent) => {
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
  };

  onmousedown = ({ point, buttons }: ViewportMouseEvent) => {
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.addPress(point);
  };

  onmouseup = ({ point, buttons }: ViewportMouseEvent) => {
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.addRelease(point);
  };

  onwheel = ({ point, deltaX, deltaY }: ViewportWheelEvent) => {
    wheelEventZoomMatrix(this.viewport, { point, deltaY });
  };

  constructor(viewport: SVGViewport, touches: SVGTouches) {
    this.viewport = viewport;
    this.touches = touches;

    this.viewport.onmousemove = this.onmousemove;
    this.viewport.onmousedown = this.onmousedown;
    this.viewport.onmouseup = this.onmouseup;
    this.viewport.onwheel = this.onwheel;
  }
}
