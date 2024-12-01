import type { Deallocable } from "../UITool.ts";

export class GlobalState implements Deallocable {
  dealloc(): void {
    // empty
  }
}
