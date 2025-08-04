import type { Deallocable } from "../../Deallocable.ts";

export class GlobalState implements Deallocable {
  dealloc(): void {
    // empty
  }
}
