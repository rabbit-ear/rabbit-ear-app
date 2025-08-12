import { type Box } from "rabbit-ear/types.js";
import { boundingBox } from "rabbit-ear/math/polygon.js";
import type { Deallocable } from "../../Deallocable.ts";
import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";
import type { Viewport } from "../../../viewports/Viewport.ts";
import type { ToolEvents } from "../../ToolEvents.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { SVGTouches } from "./SVGTouches.svelte.ts";
import SVGLayer from "./SVGLayer.svelte";
import { getSVGViewportPoint } from "../../../viewports/SVGViewport/touches.ts";
import { wheelEventZoomMatrix } from "../../zoom/matrix.ts";

export class SVGState implements Deallocable, ToolEvents {
  viewport: SVGViewport;
  globalState: GlobalState;
  touches: SVGTouches;
  unsub: (() => void)[] = [];

  box: Box | undefined = $derived.by(() => {
    if (!this.touches.press || !this.touches.drag) {
      return undefined;
    }
    const points = [
      $state.snapshot(this.touches.press),
      $state.snapshot(this.touches.drag),
    ];
    return boundingBox(points);
  });

  rect: { x: number; y: number; width: number; height: number } | undefined = $derived(
    this.box && this.box.span
      ? {
        x: this.box.min[0],
        y: this.box.min[1],
        width: this.box.span[0],
        height: this.box.span[1],
      }
      : undefined,
  );

  constructor(viewport: SVGViewport, globalState: GlobalState) {
    this.viewport = viewport;
    this.globalState = globalState;

    this.touches = new SVGTouches(this.viewport);
    this.unsub.push(this.doSelection());

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    this.viewport.layer = SVGLayer;
    const that = this;
    this.viewport.props = {
      get rect(): { x: number; y: number; width: number; height: number } | undefined {
        return that.rect;
      },
    };
  }

  dealloc(): void {
    this.unsub.forEach((u) => u());
    this.unsub = [];
    this.touches.reset();
  }

  onmousemove(viewport: Viewport, { clientX, clientY, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [clientX, clientY]);
    // console.log("mousemove", viewport, point);
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
  }

  onmousedown(viewport: Viewport, { clientX, clientY, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [clientX, clientY]);
    // console.log("mousedown", viewport, point);
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.press = point;
  }

  onmouseup(viewport: Viewport, { clientX, clientY, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [clientX, clientY]);
    // console.log("mouseup", viewport, point);
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.release = point;
  }

  // new plan for onwheel
  // all tools must implement the "zoomTool.onwheel?.(event);" behavior.
  // there is no longer an app-wide fallthrough that executes that method
  // if no tool wheel event exists. the tool must specify the behavior explicitly.
  onwheel(viewport: Viewport, { clientX, clientY, deltaY }: WheelEvent): void {
    const point = getSVGViewportPoint(viewport, [clientX, clientY]);
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

  doSelection(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (!this.touches.press || !this.touches.release) {
          return;
        }
        const points = [
          $state.snapshot(this.touches.press),
          $state.snapshot(this.touches.release),
        ];
        //app.model.selectedInsideRect(this.box);
        // app.invoker.executeJavascript(`select(${JSON.stringify([...points])})`);
        this.touches.reset();
      });
      return () => { };
    });
  }
}
