import { distance2, resize3 } from "rabbit-ear/math/vector.js";
import type { Viewport } from "../../../viewports/Viewport.ts";
import { Touches } from "./Touches.svelte.ts";
import { GlobalState } from "./GlobalState.svelte.ts";

export class Anchor {
  touches: Touches;
  viewport: Viewport;
  globalState: GlobalState;
  #effects: (() => void)[] = [];

  // origin: [number, number] | [number, number, number] = $state([0, 0]);
  parsed: [number, number] | [number, number, number] = $derived
    .by(() => this.globalState.toolOrigin.map(Number));
  origin: [number, number] | [number, number, number] = $derived([
    !isNaN(this.parsed[0]) && isFinite(this.parsed[0]) ? this.parsed[0] : 0,
    !isNaN(this.parsed[1]) && isFinite(this.parsed[1]) ? this.parsed[1] : 0,
  ]);

  selected: boolean = $state(false);

  equivalent = (point1: [number, number], point2: [number, number]): boolean =>
    distance2(point1, point2) < this.viewport.view.uiEpsilon;

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
    // this.origin = [0, 0];
    this.globalState.toolOrigin = [0, 0, 0];
    this.selected = false;
  }

  // set this object's "selected" state.
  // - false: if presses is empty, or, the press was far from the fixed point
  // - true: if presses is not empty and the press was near to the fixed point
  #updateSelected(): () => void {
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
  #update(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (!this.selected) {
          return;
        }
        if (this.touches.snapPress && this.touches.snapRelease) {
          // this.origin = this.touches.snapRelease;
          this.globalState.toolOrigin = resize3(this.touches.snapRelease);
          // console.log("fixed point: set origin position, reset()");
          // this.reset();
          return;
        }
        if (this.touches.snapDrag) {
          // this.origin = this.touches.snapDrag;
          this.globalState.toolOrigin = resize3(this.touches.snapDrag);
          return;
        }
      });
      return () => { };
    });
  }

  constructor(viewport: Viewport, touches: Touches, globalState: GlobalState) {
    this.viewport = viewport;
    this.touches = touches;
    this.globalState = globalState;
    this.#effects = [
      this.#update(),
      this.#updateSelected(),
    ]
  }

  dealloc(): void {
    this.reset();
    this.#effects.forEach(fn => fn());
    this.#effects = [];
  }
}

