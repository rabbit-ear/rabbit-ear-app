import type { WebGLViewport } from "../../viewports/WebGLViewport/WebGLViewport.svelte.ts";

export class GLViewportState {
  viewport: WebGLViewport;
  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
  }

  // empty
  dealloc(): void { }
}
