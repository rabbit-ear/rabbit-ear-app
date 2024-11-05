import type { Deallocable } from "../../viewport/Viewport.ts";

export class GlobalState implements Deallocable {
  dealloc(): void {
    // empty
  }
}
