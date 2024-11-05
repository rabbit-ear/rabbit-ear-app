import type { UITool } from "./tools/UITool.ts";
import { ViewportManager } from "./viewport/ViewportManager.svelte.ts";
import { PanelsManager } from "./panel/PanelsManager.svelte.ts";
import Tools from "./tools/index.ts";

export class UI {
  viewports: ViewportManager;
  panels: PanelsManager;
  #tool: UITool | undefined = $state();
  #effects: (() => void)[] = [];

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

  constructor() {
    this.viewports = new ViewportManager(this);
    this.panels = new PanelsManager(this);
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.viewports.dealloc();
    this.panels.dealloc();
    this.#effects.forEach((cleanup) => cleanup());
  }
}
