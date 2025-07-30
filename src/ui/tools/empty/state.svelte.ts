import type { Deallocable } from "../UITool.ts";
import type { IViewport } from "../../viewport/ViewportTypes.ts";

export class ViewportState implements Deallocable {
  viewport: IViewport;

  constructor(viewport: IViewport) {
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
