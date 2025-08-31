import { Viewport } from "../../../viewports/Viewport.ts";

export class Touches {
  viewport: Viewport;

  #move: [number, number, number] | [number, number] | undefined = $state();
  #drag: [number, number, number] | [number, number] | undefined = $state();
  #press: [number, number, number] | [number, number] | undefined = $state();
  #release: [number, number, number] | [number, number] | undefined = $state();

  snapMove: [number, number, number] | [number, number] | undefined = $state();
  snapDrag: [number, number, number] | [number, number] | undefined = $state();
  snapPress: [number, number, number] | [number, number] | undefined = $state();
  snapRelease: [number, number, number] | [number, number] | undefined = $state();

  get move(): [number, number, number] | [number, number] | undefined {
    return this.#move;
  }
  get drag(): [number, number, number] | [number, number] | undefined {
    return this.#drag;
  }
  get press(): [number, number, number] | [number, number] | undefined {
    return this.#press;
  }
  get release(): [number, number, number] | [number, number] | undefined {
    return this.#release;
  }

  set move(v: [number, number, number] | [number, number] | undefined) {
    this.#move = v;
    this.snapMove = this.#move;
    // this.snapMove = this.#move
    //   ? this.viewport.snap.snapToPoint(this.#move).coords
    //   : undefined;
  }
  set drag(v: [number, number, number] | [number, number] | undefined) {
    this.#drag = v;
    this.snapDrag = this.#drag;
    // this.snapDrag = this.#drag
    //   ? this.viewport.snap.snapToPoint(this.#drag).coords
    //   : undefined;
  }
  set press(v: [number, number, number] | [number, number] | undefined) {
    this.#press = v;
    this.snapPress = this.#press;
    // this.snapPress = this.#press
    //   ? this.viewport.snap.snapToPoint(this.#press).coords
    //   : undefined;
  }
  set release(v: [number, number, number] | [number, number] | undefined) {
    this.#release = v;
    this.snapRelease = this.#release;
    // this.snapRelease = this.#release
    //   ? this.viewport.snap.snapToPoint(this.#release).coords
    //   : undefined;
  }

  constructor(viewport: Viewport) {
    this.viewport = viewport;
  }

  reset(): void {
    this.move = undefined;
    this.drag = undefined;
    this.press = undefined;
    this.release = undefined;
    this.snapMove = undefined;
    this.snapDrag = undefined;
    this.snapPress = undefined;
    this.snapRelease = undefined;
  }
}
