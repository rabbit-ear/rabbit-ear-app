import type { Deallocable } from "../../viewport/viewport.ts";

export class GlobalState implements Deallocable {
  dealloc(): void {
    // empty
  }
}
