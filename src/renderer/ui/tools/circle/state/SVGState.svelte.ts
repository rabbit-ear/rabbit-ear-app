import { distance2 } from "rabbit-ear/math/vector.js";
import type { Deallocable } from "../../../viewport/ViewportTypes.ts";
import type { SVGViewport } from "../../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { SVGEvents } from "../events/SVGEvents.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { SVGTouches } from "./SVGTouches.svelte.ts";
import SVGLayer from "../SVGLayer.svelte";
import app from "../../../../app/App.svelte.ts";
import { AddCircle } from "../../../../kernel/commands/AddCircle.ts";

const makeCircle = (
  p0: [number, number],
  p1: [number, number],
): { cx: number; cy: number; r: number } => {
  const [cx, cy] = p0;
  const r = distance2(p0, p1);
  return { cx, cy, r };
};

export class SVGState implements Deallocable {
  viewport: SVGViewport;
  globalState: GlobalState;
  touches: SVGTouches;
  events: SVGEvents;
  unsub: (() => void)[] = [];

  circle: { cx: number; cy: number; r: number } | undefined = $derived.by(() => {
    if (this.touches.snapPresses.length && this.touches.snapReleases.length) {
      return makeCircle(this.touches.snapPresses[0], this.touches.snapReleases[0]);
    }
    if (this.touches.snapPresses.length && this.touches.snapDrag) {
      return makeCircle(this.touches.snapPresses[0], this.touches.snapDrag);
    }
    return undefined;
  });

  constructor(viewport: SVGViewport, globalState: GlobalState) {
    this.viewport = viewport;
    this.globalState = globalState;

    this.touches = new SVGTouches(this.viewport);
    this.events = new SVGEvents(this.viewport, this.touches);
    this.unsub.push(this.makeCircle());
    this.unsub.push(this.preventBadInput());

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    this.viewport.layer = SVGLayer;
    const that = this;
    this.viewport.props = {
      get circle(): { cx: number; cy: number; r: number } | undefined {
        return that.circle;
      },
    };
  }

  dealloc(): void {
    this.unsub.forEach((u) => u());
    this.unsub = [];
    this.touches.reset();
  }

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
      return () => {};
    });
  }

  makeCircle(): () => void {
    return $effect.root(() => {
      $effect(() => {
        // console.log("circle (press, release)", this.presses.length, this.releases.length);
        if (
          !this.touches.snapPresses.length ||
          !this.touches.snapReleases.length ||
          !this.circle
        ) {
          return;
        }
        app.invoker.executeCommand(
          new AddCircle(this.circle.cx, this.circle.cy, this.circle.r),
        );
        this.touches.reset();
        // setTimeout(this.reset, 10);
      });
      return () => {};
    });
  }
}
