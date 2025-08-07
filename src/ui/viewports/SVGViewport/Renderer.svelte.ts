import type { Model } from "../../../model/Model.ts";
import type { SVGViewport } from "./SVGViewport.svelte.ts";
import context from "../../../app/context.svelte.ts";

export class Renderer {

  viewport: SVGViewport;
  model?: Model = $state.raw();

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
    this.model = context.fileManager.activeDocument?.model.cp;
  }
}
