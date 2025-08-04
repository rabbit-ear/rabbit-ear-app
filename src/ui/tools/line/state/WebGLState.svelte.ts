import type { Deallocable } from "../../Deallocable.ts";
import type { WebGLViewport } from "../../../viewports/WebGLViewport/WebGLViewport.svelte.ts";

export class WebGLState implements Deallocable {
  viewport: WebGLViewport;
  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
  }
  dealloc(): void {
    // empty
  }
}
