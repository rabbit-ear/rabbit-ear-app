import { distance2, subtract2 } from "rabbit-ear/math/vector.js";
import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { SVGTouches } from "./SVGTouches.svelte.ts";

export class SVGFixedPoint {
  touches: SVGTouches;
  viewport: SVGViewport;

  origin: [number, number] = $state([0, 0]);
  selected: boolean = $state(false);

  equivalent = (point1: [number, number], point2: [number, number]) =>
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

  reset() {
    this.selected = false;
  }

  // set this object's "selected" state.
  // - false: if presses is empty, or, the press was far from the fixed point
  // - true: if presses is not empty and the press was near to the fixed point
  updateSelected() {
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
      return () => { };
    });
  }

  // set this object's "origin" position, only if:
  // "selected" is true and releases or drag is not undefined
  update() {
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
      return () => { };
    });
  }


  //// set this object's "origin" position, only if:
  //// "selected" is true if releases or drag is not undefined
  //#updatePosition() {
  //  if (this.selected && this.touches.snapDrag) {
  //    // console.log("setting origin");
  //    this.origin = this.touches.snapDrag;
  //  }
  //}

  //update() {
  //  this.#updateSelected();
  //  this.#updatePosition();
  //}

  constructor(viewport: SVGViewport, touches: SVGTouches) {
    this.viewport = viewport;
    this.touches = touches;
  }
}
