import { distance2 } from "rabbit-ear/math/vector.js";
import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";
import type { Viewport } from "../../../viewports/Viewport.ts";
import type { ToolEvents } from "../../ToolEvents.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { Touches } from "./Touches.svelte.ts";
import SVGLayer from "./SVGLayer.svelte";
import { getSVGViewportPoint } from "../../../viewports/SVGViewport/touches.ts";
import { wheelEventZoomMatrix } from "../../zoom/matrix.ts";
import context from "../../../../app/context.svelte.ts";
import { Circle } from "../../../../rulers/Circle.svelte.ts";
import { Point } from "../../../../rulers/Point.svelte.ts";

export class SVGState implements ToolEvents {
  viewport: SVGViewport;
  globalState: GlobalState;
  touches: Touches;
  unsub: (() => void)[] = [];

  circlePoints: [number, number][] | undefined = $derived.by(() => {
    if (this.touches.press && this.touches.release) {
      return [this.touches.press, this.touches.release];
    } else if (this.touches.press && this.touches.drag) {
      return [this.touches.press, this.touches.drag];
    } else {
      return undefined;
    }
  });

  circle: { radius: number, origin: [number, number] } | undefined = $derived(
    this.circlePoints
      ? ({
        radius: distance2(this.circlePoints[0], this.circlePoints[1]),
        origin: this.circlePoints[0],
      }) : undefined);

  svgCircle: { cx: number; cy: number; r: number; } | undefined = $derived(
    this.circle
      ? {
        cx: this.circle.origin[0],
        cy: this.circle.origin[1],
        r: this.circle.radius,
      }
      : undefined,
  );

  constructor(viewport: SVGViewport, globalState: GlobalState) {
    this.viewport = viewport;
    this.globalState = globalState;

    this.touches = new Touches(this.viewport);
    this.unsub.push(this.#doSelection());

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    this.viewport.layer = SVGLayer;
    this.viewport.props = {
      getSVGCircle: (): { cx: number; cy: number; r: number; } | undefined => {
        return this.svgCircle;
      },
    };
  }

  dealloc(): void {
    this.unsub.forEach((u) => u());
    this.unsub = [];
    this.touches.reset();
  }

  onmousemove(viewport: Viewport, { offsetX, offsetY, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [offsetX, offsetY]);
    // console.log("mousemove", viewport, point);
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
  }

  onmousedown(viewport: Viewport, { offsetX, offsetY, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [offsetX, offsetY]);
    // console.log("mousedown", viewport, point);
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.press = point;
  }

  onmouseup(viewport: Viewport, { offsetX, offsetY, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [offsetX, offsetY]);
    // console.log("mouseup", viewport, point);
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.release = point;
  }

  // new plan for onwheel
  // all tools must implement the "zoomTool.onwheel?.(event);" behavior.
  // there is no longer an app-wide fallthrough that executes that method
  // if no tool wheel event exists. the tool must specify the behavior explicitly.
  onwheel(viewport: Viewport, { offsetX, offsetY, deltaY }: WheelEvent): void {
    const point = getSVGViewportPoint(viewport, [offsetX, offsetY]);
    wheelEventZoomMatrix(this.viewport, { point, deltaY });
    // const panel = (this.viewport.constructor as typeof SVGViewport).settings;
    // panel.cursor = point;
  };

  // // touch screen events
  // ontouchstart?: (viewport: Viewport, event: TouchEvent) => void;
  // ontouchend?: (viewport: Viewport, event: TouchEvent) => void;
  // ontouchmove?: (viewport: Viewport, event: TouchEvent) => void;
  // ontouchcancel?: (viewport: Viewport, event: TouchEvent) => void;
  // // keyboard events
  // onkeydown?: (viewport: Viewport, event: KeyboardEvent) => void;
  // onkeyup?: (viewport: Viewport, event: KeyboardEvent) => void;

  #doSelection(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (!this.touches.press || !this.touches.release) {
          return;
        }
        const doc = context.fileManager.document;
        const circle = $state.snapshot(this.circle);
        if (doc && circle) {
          // const command = new ShapeCircleCommand(doc, this.viewport.embeddingName, box);
          // doc.executeCommand(command)
          const p0 = new Point(this.circlePoints![0]);
          const p1 = new Point(this.circlePoints![1]);
          const circleShape = new Circle(p0, p1);
          doc.data.rulers.add(p0);
          doc.data.rulers.add(p1);
          doc.data.rulers.add(circleShape);
        }
        this.touches.reset();
      });
      return () => { };
    });
  }
}
