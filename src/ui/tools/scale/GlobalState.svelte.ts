import type { Deallocable } from "../Deallocable.ts";

export class GlobalState implements Deallocable {
  smartSnap: boolean = $state(true);

  dealloc(): void {
    // empty
  }
}
