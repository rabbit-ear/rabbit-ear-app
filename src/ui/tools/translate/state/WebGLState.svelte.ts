import type { WebGLViewport } from "../../../viewports/WebGLViewport/WebGLViewport.svelte.ts";

export class WebGLState {
  viewport: WebGLViewport;
  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
  }
  dealloc(): void {
    // empty
  }
}
