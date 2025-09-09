import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";
import type { Viewport } from "../../../viewports/Viewport.ts";
import type { ToolEvents } from "../../ToolEvents.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { Touches } from "./Touches.svelte.ts";
import SVGLayer from "./SVGLayer.svelte";
import { getSVGViewportPoint } from "../../../viewports/SVGViewport/touches.ts";
import { wheelEventZoomMatrix } from "../../zoom/matrix.ts";

export class SVGState implements ToolEvents {
  viewport: SVGViewport;
  globalState: GlobalState;
  touches: Touches;
  unsub: (() => void)[] = [];

  constructor(viewport: SVGViewport, globalState: GlobalState) {
    this.viewport = viewport;
    this.globalState = globalState;

    this.touches = new Touches(this.viewport);
    this.unsub.push(this.#computeNearest());

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    this.viewport.layer = SVGLayer;
    this.viewport.props = {
      getGlobalState: () => this.globalState,
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
    if (this.globalState.locked) {
      this.globalState.unlock();
    } else {
      this.globalState.lock();
    }
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

  #computeNearest(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (!this.touches.move || this.globalState.locked) { return; }
        const point: [number, number] = [this.touches.move[0], this.touches.move[1]];
        this.globalState.nearestVertex = this.viewport.embedding?.nearestVertex?.(point);
        this.globalState.nearestEdge = this.viewport.embedding?.nearestEdge?.(point);
        this.globalState.nearestFace = this.viewport.embedding?.nearestFace?.(point);
        // console.log("setting nearest values", this.globalState.nearestVertex);
      })
      return () => { };
    })
  }
}
