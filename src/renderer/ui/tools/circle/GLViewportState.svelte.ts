import type { Deallocable } from "../../viewport/viewport.ts";
import type { WebGLViewport } from "../../viewport/WebGLViewport/WebGLViewport.svelte.ts";

export class GLViewportState implements Deallocable {
  viewport: WebGLViewport;
  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
  }
  dealloc(): void {
    // empty
  }
}
