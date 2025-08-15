import { vectorFromScreenLocation } from "../../../../../general/matrix.ts";
import type { WebGLViewport } from "../../WebGLViewport.svelte.ts";

export class Touches {
  viewport: WebGLViewport;

  cursorScreen: [number, number] = $state([0, 0]);
  cursorWorld: [number, number] = $state([0, 0]);

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    // todo: this needs to become some kind of behavior
    this.viewport.domElement?.addEventListener("mousemove", this.onmousemove.bind(this));
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
    this.viewport.domElement?.removeEventListener("mousemove", this.onmousemove);
  }
}
