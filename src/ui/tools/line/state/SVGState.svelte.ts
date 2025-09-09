import type { VecLine2 } from "rabbit-ear/types.js";
import { pointsToLine2 } from "rabbit-ear/math/convert.js";
import type { Viewport } from "../../../viewports/Viewport.ts";
import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";
import type { ToolEvents } from "../../ToolEvents.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { Touches } from "./Touches.svelte.ts";
import SVGLayer from "../svg/SVGLayer.svelte";
import { wheelEventZoomMatrix } from "../../zoom/matrix.ts";
import { getSVGViewportPoint } from "../../../viewports/SVGViewport/touches.ts";
import context from "../../../../app/context.svelte.ts";

export class SVGState implements ToolEvents {
  viewport: SVGViewport;
  globalState: GlobalState;
  touches: Touches;
  #effects: (() => void)[] = [];

  constructor(viewport: SVGViewport, globalState: GlobalState) {
    this.viewport = viewport;
    this.globalState = globalState;

    this.touches = new Touches(this.viewport);
    this.#effects = [
      this.makeLine(),
      this.preventBadInput(),
    ];

    // bind data upwards
    this.viewport.layer = SVGLayer;
    this.viewport.props = {
      getLine: (): VecLine2 | undefined => this.line,
      getSegment: (): [number, number][] | undefined => this.segment,
      getSegmentPoints: (): [number, number][] | undefined => this.segmentPoints,
    };
  }

  dealloc(): void {
    console.log("line: viewport deinit");
    this.#effects.forEach((u) => u());
    this.#effects = [];
    this.touches.reset();
  }

  line: VecLine2 | undefined = $derived.by(() => {
    if (this.touches.snapPresses.length && this.touches.snapReleases.length) {
      return pointsToLine2(this.touches.snapPresses[0], this.touches.snapReleases[0]);
    }
    if (this.touches.snapPresses.length && this.touches.snapDrag) {
      return pointsToLine2(this.touches.snapPresses[0], this.touches.snapDrag);
    }
    return undefined;
  });

  segmentPoints: [number, number][] | undefined = $derived.by(() => {
    if (!this.line) {
      return undefined;
    }
    if (!this.touches.snapPresses.length || !this.touches.snapReleases.length) {
      return undefined;
    }
    const snapLines = [
      { line: this.line, clamp: (a: number): number => a, domain: (): boolean => true },
    ];
    const snapPoint1 =
      this.touches.snapPresses.length >= 2
        ? this.viewport.snap.snapToLine(this.touches.presses[1], snapLines)
        : this.viewport.snap.snapToLine(this.touches.move, snapLines);
    const snapPoint2 =
      this.touches.snapReleases.length >= 2
        ? this.viewport.snap.snapToLine(this.touches.releases[1], snapLines)
        : this.viewport.snap.snapToLine(this.touches.drag, snapLines);
    const result = [];
    const point1 = snapPoint1 ? snapPoint1.coords : undefined;
    const point2 = snapPoint2 ? snapPoint2.coords : undefined;
    if (point1) {
      result.push(point1);
    }
    if (point2) {
      result.push(point2);
    }
    return result;
  });

  segment: [number, number][] | undefined = $derived(
    this.segmentPoints && this.segmentPoints.length < 2 ? undefined : this.segmentPoints,
  );

  onmousemove(viewport: Viewport, { x, y, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [x, y]);
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    // // todo change Settings to not export a default, get the type here.
    // const panel = (this.viewport.constructor as typeof SVGViewport).settings;
    // panel.cursor = point;
  };

  onmousedown(viewport: Viewport, { x, y, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [x, y]);
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.addPress(point);
  };

  onmouseup(viewport: Viewport, { x, y, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [x, y]);
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.addRelease(point);
  };

  // new plan for onwheel
  // all tools must implement the "zoomTool.onwheel?.(event);" behavior.
  // there is no longer an app-wide fallthrough that executes that method
  // if no tool wheel event exists. the tool must specify the behavior explicitly.
  onwheel(viewport: Viewport, { x, y, deltaY }: WheelEvent): void {
    const point = getSVGViewportPoint(viewport, [x, y]);
    wheelEventZoomMatrix(this.viewport, { point, deltaY });
    // const panel = (this.viewport.constructor as typeof SVGViewport).settings;
    // panel.cursor = point;
  };

  preventBadInput(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const moreReleases = this.touches.releases.length > this.touches.presses.length;
        const twoDifference =
          Math.abs(this.touches.releases.length - this.touches.presses.length) > 1;
        if (moreReleases || twoDifference) {
          this.touches.reset();
        }
      });
      return () => { };
    });
  }

  makeLine(): () => void {
    return $effect.root(() => {
      $effect(() => {
        // console.log("line", this.line);
        // console.log("segmentPoints", this.segmentPoints);
        if (
          this.touches.snapPresses.length >= 2 &&
          this.touches.snapReleases.length >= 2 &&
          this.segment
        ) {
          const [[x1, y1], [x2, y2]] = this.segment;
          // context.invoker.executeJavascript(`addSegment(${[x1, y1, x2, y2].join(", ")})`);
          // // context.model.addLine(x1, y1, x2, y2);
          this.touches.reset();
        }
      });
      return () => { };
    });
  }
}

