import type {
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportEvents,
} from "../../../viewport/ViewportTypes.ts";
import type { WebGLViewport } from "../../../viewport/WebGLViewport/WebGLViewport.svelte.ts";
import { rotateViewMatrix, zoomViewMatrix } from "../../../../general/matrix.ts";

// WebGL and Simulator can both use this same event class
export class WebGLEvents implements ViewportEvents {
  viewport: WebGLViewport;
  previousPoint: [number, number] | undefined;

  onmousemove = (event: ViewportMouseEvent): void => {
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

  onmousedown = (event: ViewportMouseEvent): void => {
    event.preventDefault();
    const { point } = event;
    this.previousPoint = point;
  };

  onmouseup = (_: ViewportMouseEvent): void => {
    this.previousPoint = undefined;
  };

  onwheel = (event: ViewportWheelEvent): void => {
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

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    // console.log("webgl viewport events constructor", this, this.viewport);

    this.viewport.onmousemove = this.onmousemove;
    this.viewport.onmousedown = this.onmousedown;
    this.viewport.onmouseup = this.onmouseup;
    this.viewport.onwheel = this.onwheel;
  }
}
