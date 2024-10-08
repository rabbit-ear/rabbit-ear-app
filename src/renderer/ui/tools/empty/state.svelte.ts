import type { Deallocable, Viewport } from "../../viewport/viewport.ts";

export class ViewportState implements Deallocable {
  viewport: Viewport;

  constructor(viewport: Viewport) {
    this.viewport = viewport;
  }

  dealloc(): void {
    // empty
  }
}

export class GlobalState implements Deallocable {
  dealloc(): void {
    // empty
  }
}
