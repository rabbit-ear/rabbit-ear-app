import { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";

export class SVGTouches {
  viewport: SVGViewport;

  move: [number, number] | undefined = $state();
  drags: [number, number][] = $state([]);
  presses: [number, number][] = $state([]);
  releases: [number, number][] = $state([]);

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
  }

  reset() {
    this.move = undefined;
    while (this.drags.length) {
      this.drags.pop();
    }
    while (this.presses.length) {
      this.presses.pop();
    }
    while (this.releases.length) {
      this.releases.pop();
    }
  }
}
