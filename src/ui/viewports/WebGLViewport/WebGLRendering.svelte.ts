import type { WebGLViewport } from "./WebGLViewport.svelte.ts";
import { WebGLRenderingCP } from "./WebGLRenderingCP.svelte.ts";
import { WebGLRenderingFolded } from "./WebGLRenderingFolded.svelte.ts";

export class WebGLRendering {
  // these are intended to be different rendering styles.
  // style is independent of an embedding.
  // each style also might process the input graph differently
  // (explode faces, or triangulate faces, etc..)
  cp: WebGLRenderingCP;
  folded: WebGLRenderingFolded;

  constructor(viewport: WebGLViewport) {
    this.cp = new WebGLRenderingCP(viewport);
    this.folded = new WebGLRenderingFolded(viewport);
  }

  dealloc(): void {
    this.cp.dealloc();
    this.folded.dealloc();
  }
}

