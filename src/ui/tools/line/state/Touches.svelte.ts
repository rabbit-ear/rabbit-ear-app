import type { Viewport } from "../../../viewports/Viewport.ts";

export class Touches {
  viewport: Viewport;

  #move: [number, number, number] | [number, number] | undefined = $state();
  #drag: [number, number, number] | [number, number] | undefined = $state();
  #presses: ([number, number, number] | [number, number])[] = $state([]);
  #releases: ([number, number, number] | [number, number])[] = $state([]);

  snapMove: [number, number, number] | [number, number] | undefined = $state();
  snapDrag: [number, number, number] | [number, number] | undefined = $state();
  snapPresses: ([number, number, number] | [number, number])[] = $state([]);
  snapReleases: ([number, number, number] | [number, number])[] = $state([]);

  get move(): [number, number, number] | [number, number] | undefined {
    return this.#move;
  }
  get drag(): [number, number, number] | [number, number] | undefined {
    return this.#drag;
  }
  get presses(): ([number, number, number] | [number, number])[] {
    return this.#presses;
  }
  get releases(): ([number, number, number] | [number, number])[] {
    return this.#releases;
  }

  set move(v: [number, number, number] | [number, number] | undefined) {
    this.#move = v;
    const snapPoint = this.#move
      ? this.viewport.snap.snapToPoint(this.#move)
      : undefined;
    this.snapMove = snapPoint && snapPoint.dist < this.viewport.snap.snapRadius
      ? snapPoint.coords
      : this.#move;
    // : undefined;
  }

  set drag(v: [number, number, number] | [number, number] | undefined) {
    this.#drag = v;
    const snapPoint = this.#drag
      ? this.viewport.snap.snapToPoint(this.#drag)
      : undefined;
    this.snapDrag = snapPoint && snapPoint.dist < this.viewport.snap.snapRadius
      ? snapPoint.coords
      : this.#drag;
    // : undefined;
  }

  addPress(point: [number, number] | [number, number, number]): void {
    // const snapPoint = this.viewport.snap.snapToPoint(point).coords;
    this.presses.push(point);
    // snap point will either become the nearest snap point, or the input point
    const snapPoint = this.viewport.snap.snapToPoint(point);
    const snapPress = snapPoint && snapPoint.dist < this.viewport.snap.snapRadius
      ? snapPoint.coords
      : point;
    this.snapPresses.push(snapPress);
  }

  addRelease(point: [number, number]): void {
    this.releases.push(point);
    // snap point will either become the nearest snap point, or the input point
    const snapPoint = this.viewport.snap.snapToPoint(point);
    const snapRelease = snapPoint && snapPoint.dist < this.viewport.snap.snapRadius
      ? snapPoint.coords
      : point;
    this.snapReleases.push(snapRelease);
  }

  constructor(viewport: Viewport) {
    this.viewport = viewport;
  }

  reset(): void {
    this.#move = undefined;
    this.#drag = undefined;
    this.#presses = [];
    this.#releases = [];

    this.snapMove = undefined;
    this.snapDrag = undefined;
    this.snapPresses = [];
    this.snapReleases = [];

    // while (this.#presses.length) { this.presses.pop(); }
    // while (this.#releases.length) { this.releases.pop(); }
    // while (this.snapPresses.length) { this.snapPresses.pop(); }
    // while (this.snapReleases.length) { this.snapReleases.pop(); }
  }
}

