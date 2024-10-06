import { distance2, magnitude2, subtract2 } from "rabbit-ear/math/vector.js";
import { clockwiseAngle2 } from "rabbit-ear/math/radial.js";
import type { Deallocable } from "../../viewport/viewport.ts";
import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { SVGViewportEvents } from "./events.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { SVGTouches } from "./SVGTouches.svelte.ts";
import { SVGFixedPoint } from "./SVGFixedPoint.svelte.ts";
import SVGLayer from "./SVGLayer.svelte";
import app from "../../../app/App.svelte.ts";
import { FixedPoint } from "../scale/SVGViewportState.svelte.ts";

export class SVGViewportState implements Deallocable {
  viewport: SVGViewport;
  globalState: GlobalState;
  fixedPoint: SVGFixedPoint;
  touches: SVGTouches;
  events: SVGViewportEvents;
  unsub: Function[] = [];

  // startVector: [number, number] | undefined = $derived.by(() =>
  // 	this.touches.snapPress && !this.fixedPoint.selected
  // 		? subtract2(this.touches.snapPress, this.fixedPoint.origin)
  // 		: undefined);
  startVector: [number, number] | undefined = $derived.by(() =>
    this.touches.snapPress && !this.fixedPoint.selected
      ? subtract2(this.touches.snapPress, this.fixedPoint.origin)
      : undefined,
  );

  endVector: [number, number] | undefined = $derived.by(() => {
    if (this.fixedPoint.selected) {
      return undefined;
    }
    if (this.touches.snapRelease) {
      return subtract2(this.touches.snapRelease, this.fixedPoint.origin);
    }
    if (this.touches.snapDrag) {
      return subtract2(this.touches.snapDrag, this.fixedPoint.origin);
    }
    return undefined;
  });

  angle: number = $derived(
    this.startVector && this.endVector
      ? clockwiseAngle2(this.startVector, this.endVector)
      : 0,
  );

  showRotation: boolean = $derived.by(
    () => this.touches.snapPress !== undefined && this.touches.snapRelease === undefined,
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
    this.unsub.push(this.make());

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    this.viewport.layer = SVGLayer;
    const that = this;
    this.viewport.props = {
      get fixedPoint() {
        return that.fixedPoint;
      },
      get startVector() {
        return that.startVector;
      },
      get endVector() {
        return that.endVector;
      },
      get origin() {
        return that.fixedPoint.origin;
      },
      get showRotation() {
        return that.showRotation;
      },
    };
  }

  dealloc() {
    this.unsub.forEach((u) => u());
    this.unsub = [];
    this.touches.reset();
  }

  //update() {
  //  const wasSelected = this.fixedPoint.selected;
  //  this.fixedPoint.update();
  //
  //  if (
  //    this.touches.snapPress &&
  //    this.touches.snapRelease &&
  //    !wasSelected &&
  //    !this.fixedPoint.selected
  //  ) {
  //    console.log("rotate model by", this.angle);
  //    this.reset();
  //  }
  //}

  update() {
    return $effect.root(() => {
      $effect(() => {
        // console.log("tool.update()", this.touches.snapPress, this.touches.snapRelease);
        if (this.fixedPoint.selected) {
          return;
        }
        if (!this.touches.snapPress || !this.touches.snapRelease) {
          return;
        }

        if (
          this.touches.snapPress &&
          this.touches.snapRelease &&
          //!wasSelected &&
          !this.fixedPoint.selected
        ) {
          console.log("rotate model by", this.angle);
          this.fixedPoint.reset();
          this.touches.reset();
        }
      });
      return () => { };
    });
  }

  make() {
    return $effect.root(() => {
      $effect(() => { });
      return () => { };
    });
  }
}
