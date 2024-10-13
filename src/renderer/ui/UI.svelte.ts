import type { UITool } from "./UITool.ts";
import type { Viewport } from "./viewport/viewport.ts";
import type { Panel } from "./panel/panel.ts";
import Tools from "./tools/index.ts";
import { SVGViewport } from "./viewport/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "./viewport/WebGLViewport/WebGLViewport.svelte.ts";

export class UI {
  viewports: Viewport[] = $state([]);
  #tool: UITool | undefined = $state();
  #effects: (() => void)[] = [];

  // the complete set of panels are: app-wide panels + viewport panels + tool panels
  //panels: Panel[] = $state([]);
  panels: Panel[] = $derived(
    this.viewports
      .map((view) => view?.panel)
      .concat([this.#tool?.panel])
      .filter((a) => a !== undefined),
  );

  // this binding allows each viewports' global settings objects to be accessed.
  types = {
    SVGViewport,
    WebGLViewport,
  };

  get tool(): UITool | undefined {
    return this.#tool;
  }
  // no need to set the tool directly. use a string ("line", "zoom"), the tool's name.
  // if no tool matches the string, the tool will become unset (undefined).
  setToolName(name: string): void {
    this.#tool?.dealloc();
    const NewTool: typeof UITool | undefined = Tools[name];
    // @ts-ignore - UITool is abstract, but none of these are UITools, ignore warning.
    this.#tool = NewTool === undefined ? undefined : new NewTool();
  }

  #makeToolViewportEffect = (): (() => void) =>
    $effect.root(() => {
      $effect(() => {
        this.viewports.forEach((viewport) => viewport.dealloc());
        this.viewports.forEach((viewport) => this.tool?.bindTo(viewport));
      });
      return () => {
        this.viewports.forEach((viewport) => viewport.dealloc());
      };
    });

  #triggerViewportRedraw = (): (() => void) =>
    $effect.root(() => {
      $effect(() => {
        this.viewports.forEach((viewport) => viewport.redraw?.());
      });
      return () => {};
    });

  constructor() {
    this.#effects = [this.#triggerViewportRedraw(), this.#makeToolViewportEffect()];
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.#effects.forEach((cleanup) => cleanup());
  }
}
