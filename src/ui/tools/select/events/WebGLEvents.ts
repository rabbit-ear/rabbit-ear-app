import type {
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportEvents,
} from "../../../viewports/ViewportTypes.ts";
import type { WebGLViewport } from "../../../viewports/WebGLViewport/WebGLViewport.svelte.ts";

export class WebGLEvents implements ViewportEvents {
  viewport: WebGLViewport;
  previousPoint: [number, number] | undefined;

  onmousemove = (event: ViewportMouseEvent): void => {
    //console.log("onmousemove", this, this.viewport);
    event.preventDefault();
    // const { point } = event;
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
