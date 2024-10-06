import { type Box } from "rabbit-ear/types.js";
import { boundingBox } from "rabbit-ear/math/polygon.js";
import type { Deallocable } from "../../viewport/viewport.ts";
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
  unsub: Function[] = [];

  box: Box | undefined = $derived.by(() => {
    if (!this.touches.press || !this.touches.drag) { return undefined; }
    const points = [
      $state.snapshot(this.touches.press),
      $state.snapshot(this.touches.drag),
    ];
    return boundingBox(points);
  });

  rect: any = $derived(this.box && this.box.span
    ? {
      x: this.box.min[0],
      y: this.box.min[1],
      width: this.box.span[0],
      height: this.box.span[1],
    } : undefined);

  constructor(viewport: SVGViewport, globalState: GlobalState) {
    this.viewport = viewport;
    this.globalState = globalState;

    this.touches = new SVGTouches(this.viewport);
    this.events = new SVGViewportEvents(this.viewport, this.touches);
    this.unsub.push(this.doSelection());

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    this.viewport.layer = SVGLayer;
    const that = this;
    this.viewport.props = {
      get rect() {
        return that.rect;
      },
    };
  }

  dealloc() {
    this.unsub.forEach((u) => u());
    this.unsub = [];
    this.touches.reset();
  }

  doSelection() {
    return $effect.root(() => {
      $effect(() => {
        if (!this.touches.press || !this.touches.release) { return; }
        const points = [
          $state.snapshot(this.touches.press),
          $state.snapshot(this.touches.release),
        ];
        app.model.selectedInsideRect(this.box);
        console.log("make selection", ...points);
        this.touches.reset();
      });
      return () => { };
    });
  }
}
