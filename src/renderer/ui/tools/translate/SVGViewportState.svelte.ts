import { distance2, magnitude2, subtract2 } from "rabbit-ear/math/vector.js";
import type { Deallocable } from "../../viewport/viewport.ts";
import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { SVGViewportEvents } from "./events.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { SVGTouches } from "./SVGTouches.svelte.ts";
import SVGLayer from "./SVGLayer.svelte";
import execute from "./execute.ts";
import app from "../../../app/App.svelte.ts";

export class SVGViewportState implements Deallocable {
  viewport: SVGViewport;
  globalState: GlobalState;
  touches: SVGTouches;
  events: SVGViewportEvents;
  unsub: Function[] = [];

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

    this.touches = new SVGTouches(this.viewport);
    this.events = new SVGViewportEvents(this.viewport, this.touches);
    this.unsub.push(this.doTransform());

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    this.viewport.layer = SVGLayer;
    const that = this;
    this.viewport.props = {
      get example() {
        return "example";
      },
    };
  }

  dealloc() {
    this.unsub.forEach((u) => u());
    this.unsub = [];
    this.touches.reset();
  }

  doTransform() {
    return $effect.root(() => {
      $effect(() => {
        if (!this.touches.snapPress || !this.touches.snapRelease) {
          return;
        }
        if (this.vector) {
          execute(this.vector);
        }
        this.touches.reset();
      });
      return () => { };
    });
  }
}

