import type { Deallocable } from "../../../viewport/ViewportTypes.ts";
import type { SimulatorViewport } from "../../../viewport/SimulatorViewport/SimulatorViewport.svelte.ts";
import { WebGLEvents } from "../events/WebGLEvents.ts";

export class SimulatorState implements Deallocable {
  viewport: SimulatorViewport;
  events: WebGLEvents;

  constructor(viewport: SimulatorViewport) {
    this.viewport = viewport;
    this.events = new WebGLEvents(this.viewport);
  }

  dealloc(): void {
    // empty
  }
}
