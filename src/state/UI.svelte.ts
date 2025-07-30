// import type { UITool } from "./tools/UITool.ts";
import { ViewportManager } from "./ViewportManager.svelte.ts";
// import { PanelsManager } from "./panel/PanelsManager.svelte.ts";
// import Tools from "./tools/index.ts";

export class UI {
  tool: string = $state("");
  viewportManager: ViewportManager;
  // panels: PanelsManager;

  // #tool: UITool | undefined = $state();
  //
  // get tool(): UITool | undefined {
  //   return this.#tool;
  // }
  //
  // // no need to set the tool directly. use a string ("line", "zoom"), the tool's name.
  // // if no tool matches the string, the tool will become unset (undefined).
  // setToolName(name: string): void {
  //   this.#tool?.dealloc();
  //   const NewTool: typeof UITool | undefined = Tools[name];
  //   // @ts-ignore - UITool is abstract, but none of these are UITools, ignore warning.
  //   this.#tool = NewTool === undefined ? undefined : new NewTool();
  // }

  constructor() {
    this.viewportManager = new ViewportManager(this);
    // this.panels = new PanelsManager(this);
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.viewportManager.dealloc();
    // this.panels.dealloc();
  }
};

