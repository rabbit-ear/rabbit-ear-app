import type { Deallocable } from "../../../viewport/ViewportTypes.ts";
import type { WebGLViewport } from "../../../viewport/WebGLViewport/WebGLViewport.svelte.ts";
import type { SimulatorViewport } from "../../../viewport/SimulatorViewport/SimulatorViewport.svelte.ts";

export class WebGLState implements Deallocable {
  viewport: WebGLViewport | SimulatorViewport;
  constructor(viewport: WebGLViewport | SimulatorViewport) {
    this.viewport = viewport;
  }
  dealloc(): void {
    // empty
  }
}
