import { SVGViewport } from "../../viewport/SVGViewport.svelte.ts";
import snap from "../../state/snap.svelte.ts";

export class SVGTouches {
  viewport: SVGViewport;

  move: [number, number] | undefined = $state();
  drag: [number, number] | undefined = $state();
  snapMove: [number, number] | undefined = $derived.by(() =>
    this.move ? snap.snapToPoint(this.move, this.viewport.snapRadius).coords : undefined,
  );
  snapDrag: [number, number] | undefined = $derived.by(() =>
    this.drag ? snap.snapToPoint(this.drag, this.viewport.snapRadius).coords : undefined,
  );

  presses: [number, number][] = $state([]);
  releases: [number, number][] = $state([]);
  snapPresses: [number, number][] = $state([]);
  snapReleases: [number, number][] = $state([]);

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
  }

  addPress(point: [number, number]) {
    const snapPoint = snap.snapToPoint(point, this.viewport.snapRadius).coords;
    this.presses.push(point);
    // if point is not undefined, result is not undefined
    this.snapPresses.push(snapPoint as [number, number]);
  }

  addRelease(point: [number, number]) {
    const snapPoint = snap.snapToPoint(point, this.viewport.snapRadius).coords;
    this.releases.push(point);
    // if point is not undefined, result is not undefined
    this.snapReleases.push(snapPoint as [number, number]);
  }

  reset() {
    this.move = undefined;
    this.drag = undefined;
    while (this.presses.length) {
      this.presses.pop();
    }
    while (this.releases.length) {
      this.releases.pop();
    }
    while (this.snapPresses.length) {
      this.snapPresses.pop();
    }
    while (this.snapReleases.length) {
      this.snapReleases.pop();
    }
  }
}
