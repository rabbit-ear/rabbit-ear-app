import type {
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportEvents,
} from "../../../viewports/ViewportTypes.ts";
import { SVGTouches } from "../state/SVGTouches.svelte.ts";
import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";

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

  onwheel = ({ point, deltaY }: ViewportWheelEvent): void => { };

  constructor(viewport: SVGViewport, touches: SVGTouches) {
    this.viewport = viewport;
    this.touches = touches;

    this.viewport.onmousemove = this.onmousemove;
    this.viewport.onmousedown = this.onmousedown;
    this.viewport.onmouseup = this.onmouseup;
    this.viewport.onwheel = this.onwheel;
  }
}
