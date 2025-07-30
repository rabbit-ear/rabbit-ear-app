import { boundingBox } from "rabbit-ear/math/polygon.js";
import type { Deallocable } from "../UITool.ts";
import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import app from "../../../app/App.svelte.ts";
import { SVGViewportEvents } from "./events.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { SVGTouches } from "./SVGTouches.svelte.ts";
import SVGLayer from "./SVGLayer.svelte";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const makeRect = (p0: [number, number], p1: [number, number]): Rect | undefined => {
  const box = boundingBox([p0, p1]);
  if (!box || !box.span) {
    return undefined;
  }
  const { span, min } = box;
  return { x: min[0], y: min[1], width: span[0], height: span[1] };
};

export class SVGViewportState implements Deallocable {
  viewport: SVGViewport;
  globalState: GlobalState;
  touches: SVGTouches;
  events: SVGViewportEvents;
  unsub: (() => void)[] = [];

  rect: Rect | undefined = $derived.by(() => {
    if (this.touches.snapPresses.length && this.touches.snapReleases.length) {
      return makeRect(this.touches.snapPresses[0], this.touches.snapReleases[0]);
    }
    if (this.touches.snapPresses.length && this.touches.snapDrag) {
      return makeRect(this.touches.snapPresses[0], this.touches.snapDrag);
    }
    return undefined;
  });

  constructor(viewport: SVGViewport, globalState: GlobalState) {
    this.viewport = viewport;
    this.globalState = globalState;

    this.touches = new SVGTouches(this.viewport);
    this.events = new SVGViewportEvents(this.viewport, this.touches);
    this.unsub.push(this.makeRect());
    this.unsub.push(this.preventBadInput());

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    this.viewport.layer = SVGLayer;
    const that = this;
    this.viewport.props = {
      get rect(): Rect | undefined {
        return that.rect;
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

  makeRect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (
          !this.touches.snapPresses.length ||
          !this.touches.snapReleases.length ||
          !this.rect
        ) {
          return;
        }
        app.invoker.executeJavascript(
          `addRect(${[this.rect.x, this.rect.y, this.rect.width, this.rect.height].join(", ")})`,
        );
        //app.model.addRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        this.touches.reset();
        // setTimeout(this.reset, 0);
      });
      return () => {};
    });
  }
}
