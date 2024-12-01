import type { Deallocable } from "../UITool.ts";
import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { SVGViewportEvents } from "./events.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { SVGTouches } from "./SVGTouches.svelte.ts";
import SVGLayer from "./SVGLayer.svelte";
import app from "../../../app/App.svelte.ts";

export class SVGViewportState implements Deallocable {
  viewport: SVGViewport;
  globalState: GlobalState;
  touches: SVGTouches;
  events: SVGViewportEvents;
  unsub: (() => void)[] = [];

  segment: [[number, number], [number, number]] | undefined = $derived.by(() => {
    if (this.touches.snapPress && this.touches.snapRelease) {
      return [this.touches.snapPress, this.touches.snapRelease];
    }
    if (this.touches.snapPress && this.touches.snapDrag) {
      return [this.touches.snapPress, this.touches.snapDrag];
    }
    return undefined;
  });

  line: { x1: number; y1: number; x2: number; y2: number } | undefined = $derived(
    !this.segment
      ? undefined
      : {
          x1: this.segment[0][0],
          y1: this.segment[0][1],
          x2: this.segment[1][0],
          y2: this.segment[1][1],
        },
  );

  constructor(viewport: SVGViewport, globalState: GlobalState) {
    this.viewport = viewport;
    this.globalState = globalState;

    this.touches = new SVGTouches(this.viewport);
    this.events = new SVGViewportEvents(this.viewport, this.touches);
    this.unsub.push(this.makeSegment());

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    this.viewport.layer = SVGLayer;
    const that = this;
    this.viewport.props = {
      get line(): { x1: number; y1: number; x2: number; y2: number } {
        return that.line;
      },
    };
  }

  dealloc(): void {
    this.unsub.forEach((u) => u());
    this.unsub = [];
    this.touches.reset();
  }

  makeSegment(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (!this.touches.snapPress || !this.touches.snapRelease || !this.segment) {
          return;
        }
        const [[x1, y1], [x2, y2]] = this.segment;
        app.invoker.executeJavascript(`addSegment(${[x1, y1, x2, y2].join(", ")})`);
        //app.model.addLine(x1, y1, x2, y2);
        this.touches.reset();
      });
      return () => {};
    });
  }
}
