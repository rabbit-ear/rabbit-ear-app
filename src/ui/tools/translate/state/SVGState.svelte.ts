import { magnitude, subtract2 } from "rabbit-ear/math/vector.js";
import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";
import type { Viewport } from "../../../viewports/Viewport.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { Touches } from "./Touches.svelte.ts";
import SVGLayer from "../svg/SVGLayer.svelte";
import { getSVGViewportPoint } from "../../../viewports/SVGViewport/touches.ts";
import { wheelEventZoomMatrix, wheelPanMatrix } from "../../zoom/matrix.ts";
import { AffineTranslateCommand } from "../../../../commands/AffineTranslateCommand.ts";
import context from "../../../../app/context.svelte.ts";

export class SVGState {
  viewport: SVGViewport;
  globalState: GlobalState;
  touches: Touches;
  #effects: (() => void)[] = [];

  vector: [number, number] | undefined = $derived.by(() => {
    if (this.touches.snapPress && this.touches.snapRelease) {
      return subtract2(this.touches.snapRelease, this.touches.snapPress);
    }
    if (this.touches.snapPress && this.touches.snapDrag) {
      return subtract2(this.touches.snapDrag, this.touches.snapPress);
    }
    return undefined;
  });

  constructor(viewport: SVGViewport, globalState: GlobalState) {
    this.viewport = viewport;
    this.globalState = globalState;

    this.touches = new Touches(this.viewport);
    this.#effects = [
      this.#effectTransform(),
    ];

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    this.viewport.layer = SVGLayer;
    //const that = this;
    this.viewport.props = {
      getVector: (): [number, number] | undefined => { return this.vector; },
      getPressed: (): [number, number] | undefined => { return this.touches.snapPress; },
      getIsPressed: (): boolean => { return this.touches.snapPress !== undefined; },
      // todo: see if we can pass this off to the Panel somehow
      getGlobalState: (): GlobalState => { return this.globalState; }
    };
  }

  dealloc(): void {
    this.#effects.forEach((u) => u());
    this.#effects = [];
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

  #effectTransform(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (!this.touches.snapPress || !this.touches.snapRelease || !this.vector) {
          return;
        }
        if (Math.abs(magnitude(this.vector)) < 1e-6) {
          this.touches.reset();
          return;
        }
        const doc = context.fileManager.document;
        if (doc) {
          const command = new AffineTranslateCommand(
            doc,
            this.vector,
            context.fileManager.document?.data.selection,
            context.ui.settings.selectionHandling.value === "detach");
          doc.executeCommand(command)
        }
        this.touches.reset();
      });
      return () => { };
    });
  }
}

