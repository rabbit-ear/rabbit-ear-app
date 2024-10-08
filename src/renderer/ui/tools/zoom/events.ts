import type {
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportEvents,
} from "../../viewport/events.ts";
import { ToolState } from "./state.svelte.ts";
import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import type { WebGLViewport } from "../../viewport/WebGLViewport/WebGLViewport.svelte.ts";
import { wheelEventZoomMatrix, wheelPanMatrix } from "./matrix.ts";
import { rotateViewMatrix, zoomViewMatrix } from "../../../general/matrix.ts";

export class WebGLViewportEvents implements ViewportEvents {
  viewport: WebGLViewport;
  previousPoint: [number, number] | undefined;

  onmousemove = (event: ViewportMouseEvent): void => {
    // console.log("onmousemove", this, this.viewport);
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

// class SVGViewportEvents implements ToolViewportInstance {
export class SVGViewportEvents implements ViewportEvents {
  tool: ToolState;
  viewport: SVGViewport;

  onmousemove = ({ point, buttons }: ViewportMouseEvent): void => {
    this.tool.move = buttons ? undefined : point;
    this.tool.drag = buttons ? point : undefined;
  };

  onmousedown = ({ point, buttons }: ViewportMouseEvent): void => {
    this.tool.move = buttons ? undefined : point;
    this.tool.drag = buttons ? point : undefined;
    this.tool.press = point;
  };

  onmouseup = ({ point, buttons }: ViewportMouseEvent): void => {
    this.tool.move = buttons ? undefined : point;
    this.tool.drag = buttons ? point : undefined;
    // this.tool.release = point;
    this.tool.reset();
  };

  // onmouseleave = (event: ViewportMouseEvent) => {
  // 	this.tool.reset();
  // };

  // new plan for onwheel
  // all tools must implement the "zoomTool.onwheel?.(event);" behavior.
  // there is no longer an app-wide fallthrough that executes that method
  // if no tool wheel event exists. the tool must specify the behavior explicitly.

  onwheel = ({ point, deltaX, deltaY }: ViewportWheelEvent): void => {
    const type: string = "svg"; // this.viewport.type;
    switch (type) {
      case "svg":
        return wheelPanMatrix(this.viewport, { deltaX, deltaY });
      case "webgl":
        return wheelEventZoomMatrix(this.viewport, { point, deltaY });
      default:
        return wheelEventZoomMatrix(this.viewport, { point, deltaY });
    }
  };

  constructor(viewport: SVGViewport, tool: ToolState) {
    this.viewport = viewport;
    this.tool = tool;

    this.viewport.onmousemove = this.onmousemove;
    this.viewport.onmousedown = this.onmousedown;
    this.viewport.onmouseup = this.onmouseup;
    // this.viewport.onmouseleave = this.onmouseleave;
    this.viewport.onwheel = this.onwheel;
  }
}
