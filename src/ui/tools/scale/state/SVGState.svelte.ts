import { magnitude2, subtract2 } from "rabbit-ear/math/vector.js";
import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";
import type { Viewport } from "../../../viewports/Viewport.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { Touches } from "./Touches.svelte.ts";
import { FixedPoint } from "./FixedPoint.svelte.ts";
import SVGLayer from "../svg/SVGLayer.svelte";
import { getSVGViewportPoint } from "../../../viewports/SVGViewport/touches.ts";
import { wheelEventZoomMatrix, wheelPanMatrix } from "../../zoom/matrix.ts";
import context from "../../../../app/context.svelte.ts";
import { AffineScaleCommand } from "../../../../commands/AffineScaleCommand.ts";
import { untrack } from "svelte";

export class SVGState {
  viewport: SVGViewport;
  globalState: GlobalState;
  touches: Touches;
  fixedPoint: FixedPoint;
  #effects: (() => void)[] = [];

  startVector: [number, number] | undefined = $derived.by(() => {
    return this.touches && this.touches.snapPress
      ? subtract2(this.touches.snapPress, this.fixedPoint.origin)
      : undefined;
  });

  endVector: [number, number] | undefined = $derived.by(() => {
    if (this.touches.snapRelease) {
      return subtract2(this.touches.snapRelease, this.fixedPoint.origin);
    }
    if (this.touches.snapDrag) {
      return subtract2(this.touches.snapDrag, this.fixedPoint.origin);
    }
    return undefined;
  });

  scale: number = $derived(
    this.startVector && this.endVector
      ? magnitude2(this.endVector) / magnitude2(this.startVector)
      : 1,
  );

  constructor(viewport: SVGViewport, globalState: GlobalState) {
    this.viewport = viewport;
    this.globalState = globalState;

    this.touches = new Touches(this.viewport);
    this.fixedPoint = new FixedPoint(this.viewport, this.touches);
    this.#effects = [
      this.#update(),
      this.#resetToolOrigin(),
    ];

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    this.viewport.layer = SVGLayer;
    this.viewport.props = {
      getFixedPoint: (): FixedPoint => { return this.fixedPoint; },
    };
  }

  dealloc(): void {
    this.#effects.forEach((u) => u());
    this.#effects = [];
    this.fixedPoint.dealloc();
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
    // todo: is this necessary? can it be removed?
    this.touches.release = undefined;
  }

  onmouseup(viewport: Viewport, { clientX, clientY, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [clientX, clientY]);
    // console.log("mouseup", viewport, point);
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.release = point;
  }

  onwheel(viewport: Viewport, { clientX, clientY, deltaX, deltaY }: WheelEvent): void {
    const point = getSVGViewportPoint(viewport, [clientX, clientY]);
    // const panel = (this.viewport.constructor as typeof SVGViewport).settings;
    // panel.cursor = point;
    return context.keyboardManager.command || context.keyboardManager.control
      ? wheelPanMatrix(this.viewport, { deltaX, deltaY })
      : wheelEventZoomMatrix(this.viewport, { point, deltaY });
  };

  // // touch screen events
  // ontouchstart?: (viewport: Viewport, event: TouchEvent) => void;
  // ontouchend?: (viewport: Viewport, event: TouchEvent) => void;
  // ontouchmove?: (viewport: Viewport, event: TouchEvent) => void;
  // ontouchcancel?: (viewport: Viewport, event: TouchEvent) => void;
  // // keyboard events
  // onkeydown?: (viewport: Viewport, event: KeyboardEvent) => void;
  // onkeyup?: (viewport: Viewport, event: KeyboardEvent) => void;

  #update(): () => void {
    return $effect.root(() => {
      $effect(() => {
        // console.log("tool.update()", this.touches.snapPress, this.touches.snapRelease);
        if (this.fixedPoint.selected) {
          return;
        }
        if (!this.touches.snapPress || !this.touches.snapRelease) {
          return;
        }
        if (Math.abs(this.scale) < 1e-6) {
          return;
        }
        console.log("scale model by", $state.snapshot(this.scale));
        const doc = context.fileManager.document;
        if (doc) {
          const command = new AffineScaleCommand(doc, this.scale, this.fixedPoint.origin);
          doc.executeCommand(command)
        }
        // this.fixedPoint.reset();
        this.touches.reset();
      });
      return () => { };
    });
  }

  #resetToolOrigin(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = context.fileManager.document?.data.frame;
        untrack(() => {
          this.fixedPoint.reset();
          this.touches.reset();
        });
      });
      return () => { };
    });
  }
}

