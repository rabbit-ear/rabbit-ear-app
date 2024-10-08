import type {
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportEvents,
} from "../../viewport/events.ts";
import type { SVGViewportState } from "./SVGViewportState.svelte.ts";
import type { SVGTouches } from "./SVGTouches.svelte.ts";
import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { wheelEventZoomMatrix } from "../zoom/matrix.ts";

export class SVGViewportEvents implements ViewportEvents {
  touches: SVGTouches;
  viewport: SVGViewport;
  state: SVGViewportState;

  onmousemove = ({ point, buttons }: ViewportMouseEvent): void => {
    this.touches.move = buttons ? undefined : point;
    if (buttons) {
      this.touches.drags.push(point);
    }
  };

  onmousedown = ({ point, buttons }: ViewportMouseEvent): void => {
    this.touches.move = buttons ? undefined : point;
    this.touches.drags = [];
    this.touches.presses.push(point);
  };

  onmouseup = ({ point, buttons }: ViewportMouseEvent): void => {
    this.touches.move = buttons ? undefined : point;
    this.touches.releases.push(point);
    this.state.addToModel();
  };

  onwheel = ({ point, deltaY }: ViewportWheelEvent): void => {
    wheelEventZoomMatrix(this.viewport, { point, deltaY });
  };

  constructor(viewport: SVGViewport, touches: SVGTouches, state: SVGViewportState) {
    this.viewport = viewport;
    this.touches = touches;
    this.state = state;

    this.viewport.onmousemove = this.onmousemove;
    this.viewport.onmousedown = this.onmousedown;
    this.viewport.onmouseup = this.onmouseup;
    this.viewport.onwheel = this.onwheel;
  }
}
