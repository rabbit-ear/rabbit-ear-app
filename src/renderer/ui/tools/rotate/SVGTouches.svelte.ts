import { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";

export class SVGTouches {
  viewport: SVGViewport;

  #move: [number, number] | undefined = $state();
  #drag: [number, number] | undefined = $state();
  #press: [number, number] | undefined = $state();
  #release: [number, number] | undefined = $state();

  snapMove: [number, number] | undefined = $state();
  snapDrag: [number, number] | undefined = $state();
  snapPress: [number, number] | undefined = $state();
  snapRelease: [number, number] | undefined = $state();

  get move() {
    return this.#move;
  }
  get drag() {
    return this.#drag;
  }
  get press() {
    return this.#press;
  }
  get release() {
    return this.#release;
  }

  set move(v: [number, number] | undefined) {
    this.#move = v;
    this.snapMove = this.#move ? this.viewport.snap.snapToPoint(this.#move).coords : undefined;
  }
  set drag(v: [number, number] | undefined) {
    this.#drag = v;
    this.snapDrag = this.#drag ? this.viewport.snap.snapToPoint(this.#drag).coords : undefined;
  }
  set press(v: [number, number] | undefined) {
    this.#press = v;
    this.snapPress = this.#press ? this.viewport.snap.snapToPoint(this.#press).coords : undefined;
  }
  set release(v: [number, number] | undefined) {
    this.#release = v;
    this.snapRelease = this.#release ? this.viewport.snap.snapToPoint(this.#release).coords : undefined;
  }

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
  }

  reset() {
    this.move = undefined;
    this.drag = undefined;
    this.press = undefined;
    this.release = undefined;
  }
}
