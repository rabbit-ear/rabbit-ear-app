import type { Deallocable } from "../../viewport/viewport.ts";

export class GlobalState implements Deallocable {
  smartSnap: boolean = $state(true);

  dealloc(): void {
    // empty
  }
}
