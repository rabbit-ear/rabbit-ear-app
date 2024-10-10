import { distance2, magnitude2, subtract2 } from "rabbit-ear/math/vector.js";
import type { Deallocable } from "../../../viewport/viewport.ts";
import type { SVGViewport } from "../../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { SVGViewportEvents } from "../events.ts";
import { GlobalState } from "../GlobalState.svelte.ts";
import { SVGTouches } from "./SVGTouches.svelte.ts";
import SVGLayer from "./SVGLayer.svelte";
//import app from "../../../app/App.svelte.ts";

export class SVGFixedPoint {
  touches: SVGTouches;
  viewport: SVGViewport;

  origin: [number, number] = $state([0, 0]);
  selected: boolean = $state(false);

  equivalent = (point1: [number, number], point2: [number, number]): boolean =>
    distance2(point1, point2) < this.viewport.uiEpsilon;

  highlighted: boolean = $derived.by(() => {
    if (this.touches.snapDrag) {
      return this.equivalent(this.origin, this.touches.snapDrag);
    }
    if (this.touches.snapMove) {
      return this.equivalent(this.origin, this.touches.snapMove);
    }
    return false;
  });

  reset(): void {
    this.selected = false;
  }

  // set this object's "selected" state.
  // - false: if presses is empty, or, the press was far from the fixed point
  // - true: if presses is not empty and the press was near to the fixed point
  updateSelected(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (this.selected) {
          if (!this.touches.snapDrag) {
            this.selected = false;
          }
        } else {
          if (this.touches.snapPress) {
            this.selected = this.equivalent(this.origin, this.touches.snapPress);
            // untrack(() => this.selected = equivalent(this.origin, this.touches.snapPress));
          }
        }
      });
      return () => {};
    });
  }

  // set this object's "origin" position, only if:
  // "selected" is true and releases or drag is not undefined
  update(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (!this.selected) {
          return;
        }
        if (this.touches.snapPress && this.touches.snapRelease) {
          this.origin = this.touches.snapRelease;
          // console.log("fixed point: set origin position, reset()");
          // this.reset();
          return;
        }
        if (this.touches.snapDrag) {
          this.origin = this.touches.snapDrag;
          return;
        }
      });
      return () => {};
    });
  }

  constructor(viewport: SVGViewport, touches: SVGTouches) {
    this.viewport = viewport;
    this.touches = touches;
  }
}

export class SVGViewportState implements Deallocable {
  viewport: SVGViewport;
  globalState: GlobalState;
  touches: SVGTouches;
  fixedPoint: SVGFixedPoint;
  events: SVGViewportEvents;
  unsub: (() => void)[] = [];

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

    this.touches = new SVGTouches(this.viewport);
    this.fixedPoint = new SVGFixedPoint(this.viewport, this.touches);
    this.events = new SVGViewportEvents(this.viewport, this.touches);
    this.unsub.push(this.fixedPoint.update());
    this.unsub.push(this.fixedPoint.updateSelected());
    this.unsub.push(this.update());

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    this.viewport.layer = SVGLayer;
    const that = this;
    this.viewport.props = {
      get fixedPoint(): SVGFixedPoint {
        return that.fixedPoint;
      },
    };
  }

  dealloc(): void {
    this.unsub.forEach((u) => u());
    this.unsub = [];
    this.fixedPoint.reset();
    this.touches.reset();
  }

  update(): () => void {
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
        console.log("scale model by", this.scale);
        this.fixedPoint.reset();
        this.touches.reset();
      });
      return () => {};
    });
  }
}
