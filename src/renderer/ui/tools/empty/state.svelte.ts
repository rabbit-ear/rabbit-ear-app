import type { Deallocable, Viewport } from "../../viewport/viewport.ts";

export class ViewportState implements Deallocable {
  viewport: Viewport;

  constructor(viewport: Viewport) {
    this.viewport = viewport;
  }

  dealloc() { }
}

export class GlobalState implements Deallocable {
  constructor() { }
  dealloc() { }
}
