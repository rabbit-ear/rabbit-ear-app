import type { Deallocable } from "../../viewport/ViewportTypes.ts";

export class GlobalState implements Deallocable {
  dealloc(): void {
    // empty
  }
}
