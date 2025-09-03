import { magnitude2, subtract2 } from "rabbit-ear/math/vector.js";
import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";
import type { Viewport } from "../../../viewports/Viewport.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { Touches } from "./Touches.svelte.ts";
import { Anchor } from "./Anchor.svelte.ts";
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
  anchor: Anchor;
  #effects: (() => void)[] = [];

  startVector: [number, number] | undefined = $derived.by(() => {
    return this.touches && this.touches.snapPress
      ? subtract2(this.touches.snapPress, this.anchor.origin)
      : undefined;
  });

  endVector: [number, number] | undefined = $derived.by(() => {
    if (this.touches.snapRelease) {
      return subtract2(this.touches.snapRelease, this.anchor.origin);
    }
    if (this.touches.snapDrag) {
      return subtract2(this.touches.snapDrag, this.anchor.origin);
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
    this.anchor = new Anchor(this.viewport, this.touches, this.globalState);
    this.#effects = [
      this.#update(),
      this.#resetToolOrigin(),
    ];

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    this.viewport.layer = SVGLayer;
    this.viewport.props = {
      getStartVector: (): [number, number] | undefined => { return this.startVector; },
      getEndVector: (): [number, number] | undefined => { return this.endVector; },
      getAnchor: (): Anchor => { return this.anchor; },
      getIsPressed: (): boolean => { return this.touches.snapPress !== undefined; },
      // todo: see if we can pass this off to the Panel somehow
      getGlobalState: (): GlobalState => { return this.globalState; }
    };
  }

  dealloc(): void {
    this.#effects.forEach((u) => u());
    this.#effects = [];
    this.anchor.dealloc();
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
    // todo: is this necessary? can it be removed?
    this.touches.release = undefined;
  }

  onmouseup(viewport: Viewport, { offsetX, offsetY, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [offsetX, offsetY]);
    // console.log("mouseup", viewport, point);
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.release = point;
  }

  onwheel(viewport: Viewport, { offsetX, offsetY, deltaX, deltaY }: WheelEvent): void {
    const point = getSVGViewportPoint(viewport, [offsetX, offsetY]);
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
        if (this.anchor.selected) {
          return;
        }
        if (!this.touches.snapPress || !this.touches.snapRelease) {
          return;
        }
        if (Math.abs(this.scale) < 1e-6) {
          this.touches.reset();
          return;
        }
        console.log("scale model by", $state.snapshot(this.scale));
        const doc = context.fileManager.document;
        if (doc) {
          const command = new AffineScaleCommand(doc, this.scale, this.anchor.origin);
          doc.executeCommand(command)
        }
        // this.anchor.reset();
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
          this.anchor.reset();
          this.touches.reset();
        });
      });
      return () => { };
    });
  }
}

