import type { Deallocable } from "../../UITool.ts";
import type { WebGLViewport } from "../../../viewport/WebGLViewport/WebGLViewport.svelte.ts";

export class WebGLState implements Deallocable {
  viewport: WebGLViewport;
  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
  }
  dealloc(): void {
    // empty
  }
}
