import type { Deallocable } from "../../viewport/viewport.ts";
import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { SVGViewportEvents } from "./events.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { SVGTouches } from "./SVGTouches.svelte.ts";
import SVGLayer from "./SVGLayer.svelte";
import app from "../../../app/App.svelte.ts";

const makePathD = (points: [number, number][]): string => {
  const start = points[0];
  if (!start) {
    return "";
  }
  const startString = `M${start[0].toFixed(4)} ${start[1].toFixed(4)}`;
  if (points.length < 2) {
    return startString;
  }
  return (
    startString +
    Array.from(Array(points.length - 1))
      .map((_, i) => i + 1)
      .map((i) => `L${points[i][0].toFixed(4)} ${points[i][1].toFixed(4)}`)
      .join("")
  );
};

export class SVGViewportState implements Deallocable {
  viewport: SVGViewport;
  globalState: GlobalState;
  touches: SVGTouches;
  events: SVGViewportEvents;
  unsub: (() => void)[] = [];

  pathD: string = $derived.by(() => {
    const points: [number, number][] = $state
      .snapshot(this.touches.drags)
      .map(([p0, p1]) => [p0, p1]);
    return makePathD(points);
  });

  constructor(viewport: SVGViewport, globalState: GlobalState) {
    this.viewport = viewport;
    this.globalState = globalState;

    this.touches = new SVGTouches(this.viewport);
    this.events = new SVGViewportEvents(this.viewport, this.touches, this);
    //this.unsub.push(this.preventBadInput());

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    this.viewport.layer = SVGLayer;
    const that = this;
    this.viewport.props = {
      get path(): string {
        return that.pathD;
      },
    };
  }

  dealloc(): void {
    this.unsub.forEach((u) => u());
    this.unsub = [];
    this.touches.reset();
  }

  //preventBadInput() {
  //  return $effect.root(() => {
  //    $effect(() => {
  //      const moreReleases = this.touches.releases.length > this.touches.presses.length;
  //      const twoDifference =
  //        Math.abs(this.touches.releases.length - this.touches.presses.length) > 1;
  //      if (moreReleases || twoDifference) {
  //        this.touches.reset();
  //      }
  //    });
  //    return () => { };
  //  });
  //}

  addToModel(): void {
    const points: [number, number][] = $state
      .snapshot(this.touches.drags)
      .map(([p0, p1]) => [p0, p1]);
    // console.log("adding path to model", makePathD(points));
    app.model.addPath({ d: makePathD(points) });
    this.touches.reset();
  }
}
