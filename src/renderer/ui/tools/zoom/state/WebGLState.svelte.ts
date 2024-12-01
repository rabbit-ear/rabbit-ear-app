import type { Deallocable } from "../../UITool.ts";
import type { WebGLViewport } from "../../../viewport/WebGLViewport/WebGLViewport.svelte.ts";
import { WebGLEvents } from "../events/WebGLEvents.ts";

export class WebGLState implements Deallocable {
  viewport: WebGLViewport;
  events: WebGLEvents;

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.events = new WebGLEvents(this.viewport);
  }

  dealloc(): void {
    // empty
  }
}
