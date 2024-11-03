import type {
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportEvents,
} from "../../viewport/viewport.ts";
import { SVGTouches } from "./SVGTouches.svelte.ts";
import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { wheelEventZoomMatrix } from "../zoom/matrix.ts";

export class SVGViewportEvents implements ViewportEvents {
  touches: SVGTouches;
  viewport: SVGViewport;

  onmousemove = ({ point, buttons }: ViewportMouseEvent): void => {
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
  };

  onmousedown = ({ point, buttons }: ViewportMouseEvent): void => {
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.press = point;
  };

  onmouseup = ({ point, buttons }: ViewportMouseEvent): void => {
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.release = point;
  };

  onwheel = ({ point, deltaY }: ViewportWheelEvent): void => {
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
