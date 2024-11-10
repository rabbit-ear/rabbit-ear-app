import type {
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportEvents,
} from "../../../viewport/ViewportTypes.ts";
import type { SVGTouches } from "../state/SVGTouches.svelte.ts";
import type { SVGViewport } from "../../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { wheelEventZoomMatrix } from "../../zoom/matrix.ts";

export class SVGEvents implements ViewportEvents {
  touches: SVGTouches;
  viewport: SVGViewport;

  onmousemove = ({ point, buttons }: ViewportMouseEvent): void => {
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
  };

  onmousedown = ({ point, buttons }: ViewportMouseEvent): void => {
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.addPress(point);
  };

  onmouseup = ({ point, buttons }: ViewportMouseEvent): void => {
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.addRelease(point);
  };

  // new plan for onwheel
  // all tools must implement the "zoomTool.onwheel?.(event);" behavior.
  // there is no longer an app-wide fallthrough that executes that method
  // if no tool wheel event exists. the tool must specify the behavior explicitly.

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
