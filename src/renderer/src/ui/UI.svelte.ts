import type { UITool } from "./UITool.ts";
import type { Viewport } from "./viewport/viewport.ts";
import Tools from "./tools/index.ts";
import { SVGViewport } from "./viewport/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "./viewport/WebGLViewport/WebGLViewport.svelte.ts";

export class UI {
  viewports: Viewport[] = $state([]);
  #tool: UITool | undefined = $state();
  #effects: Function[] = [];

  // this binding allows each viewports' global settings objects to be accessed.
  types = {
    SVGViewport,
    WebGLViewport,
  }

  get tool() {
    return this.#tool;
  }
  // no need to set the tool directly. use a string ("line", "zoom"), the tool's name.
  // if no tool matches the string, the tool will become unset (undefined).
  setToolName(name: string) {
    this.#tool?.dealloc();
    const NewTool: typeof UITool | undefined = Tools[name];
    // @ts-ignore - UITool is abstract, but none of these are UITools, ignore warning.
    this.#tool = NewTool === undefined ? undefined : new NewTool();
  }

  #makeToolViewportEffect = () => $effect.root(() => {
    $effect(() => {
      this.viewports.forEach((viewport) => viewport.dealloc());
      this.viewports.forEach((viewport) => this.tool?.bindTo(viewport));
    });
    return () => {
      this.viewports.forEach((viewport) => viewport.dealloc());
    };
  });

  #triggerViewportRedraw = () => $effect.root(() => {
    $effect(() => {
      this.viewports.forEach(viewport => viewport.redraw?.());
    });
    return () => { };
  })

  constructor() {
    this.#effects = [this.#triggerViewportRedraw(), this.#makeToolViewportEffect()];
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc() {
    this.#effects.forEach((cleanup) => cleanup());
  }
};

