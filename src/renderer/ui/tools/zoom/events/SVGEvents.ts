import type {
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportEvents,
} from "../../../viewport/ViewportTypes.ts";
import type { ToolState } from "../state/SVGState.svelte.ts";
import type { SVGViewport } from "../../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { scale2, subtract2 } from "rabbit-ear/math/vector.js";
import { panCameraMatrix } from "../matrix.ts";
import { wheelEventZoomMatrix, wheelPanMatrix } from "../matrix.ts";

// class SVGViewportEvents implements ToolViewportInstance {
export class SVGEvents implements ViewportEvents {
  tool: ToolState;
  viewport: SVGViewport;
  cameraMatrixOnPress: number[];
  clientPress: [number, number] = [0, 0];

  onmousemove = ({ point, buttons, clientX, clientY }: ViewportMouseEvent): void => {
    this.tool.move = buttons ? undefined : point;
    this.tool.drag = buttons ? point : undefined;
    this.tool.dragVector =
      !this.tool.drag || !this.tool.press
        ? [0, 0]
        : subtract2(this.tool.drag, this.tool.press);
    const impliedScale = this.viewport.view.view[0];
    // todo: this scale is arbitrary. needs to be a factor of the
    const drag = scale2(subtract2([clientX, clientY], this.clientPress), 1 / 300);

    if (this.tool.drag && this.tool.press) {
      const translation: [number, number] = [
        drag[0] * impliedScale,
        drag[1] * impliedScale,
        //drag[1] * impliedScale * (this.viewport.view.rightHanded ? -1 : 1),
      ];

      this.viewport.view.camera = panCameraMatrix(this.cameraMatrixOnPress, translation);
    }
  };

  onmousedown = ({ point, buttons, clientX, clientY }: ViewportMouseEvent): void => {
    this.tool.move = buttons ? undefined : point;
    this.tool.drag = buttons ? point : undefined;
    this.tool.press = point;
    this.tool.dragVector = [0, 0];
    this.clientPress = [clientX, clientY];
    this.cameraMatrixOnPress = this.viewport.view.camera;
  };

  onmouseup = ({ point, buttons }: ViewportMouseEvent): void => {
    this.tool.move = buttons ? undefined : point;
    this.tool.drag = buttons ? point : undefined;
    // this.tool.release = point;
    this.tool.dragVector = [0, 0];
    this.clientPress = [0, 0];
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
