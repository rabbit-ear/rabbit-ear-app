import { vectorFromScreenLocation } from "../../../../../general/matrix.ts";
import type { WebGLViewport } from "../../WebGLViewport.svelte.ts";

export class Touches {
  viewport: WebGLViewport;

  cursorScreen: [number, number] = $state([0, 0]);
  cursorWorld: [number, number] = $state([0, 0]);

  #effects: (() => void)[] = [];

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.#effects = [this.#bindToElement()];
  }

  onmousemove(event: MouseEvent) {
    const coords: [number, number] = [event.offsetX, event.offsetY];
    const cursorWorld = vectorFromScreenLocation(
      coords,
      this.viewport.view.canvasSize ?? [1, 1],
      this.viewport.view.projection);
    this.cursorScreen = coords;
    this.cursorWorld = cursorWorld;
  }

  dealloc(): void {
    this.#effects.forEach(fn => fn());
  }

  #bindToElement(): () => void {
    return $effect.root(() => {
      $effect(() => {
        this.viewport.domElement?.addEventListener("mousemove", this.onmousemove.bind(this));
      });
      return () => {
        this.viewport.domElement?.removeEventListener("mousemove", this.onmousemove);
      };
    });
  }
}
