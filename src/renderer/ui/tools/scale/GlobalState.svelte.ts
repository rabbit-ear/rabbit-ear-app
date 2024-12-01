import type { Deallocable } from "../UITool.ts";

export class GlobalState implements Deallocable {
  smartSnap: boolean = $state(true);

  dealloc(): void {
    // empty
  }
}
