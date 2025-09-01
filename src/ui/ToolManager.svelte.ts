import type { UI } from "./UI.svelte";
import type { Viewport } from "./viewports/Viewport.ts";
import type { Tool } from "./tools/Tool.ts";
import Tools from "./tools/index.ts";

type ToolConstructor<T extends Tool = Tool> = new () => T;

export class ToolManager {
  #ui: UI;
  // #tool: Tool | undefined = $state();
  tool: Tool | undefined = $state();
  #unbindFromViewports: Map<Viewport, () => void> = new Map();

  // get tool(): Tool | undefined { return this.#tool; }

  // toolName: string = $derived((this.#tool?.constructor as typeof Tool).key ?? "");
  toolName: string = $derived((this.tool?.constructor as typeof Tool).key ?? "");

  // tools: { [key: string]: ToolConstructor<Tool> } = $derived(Tools);
  tools: { [key: string]: ToolConstructor<Tool> } = $derived.by(() => Object
    .fromEntries(Object
      .entries(Tools)
      .filter(([_, Tool]) => Tool.modes
        .includes(this.#ui.settings.mode))));

  constructor(ui: UI) {
    this.#ui = ui;
  }

  dealloc(): void {
    // todo: anything we need to do here?
  }

  unbindTool(): void {
    // this.#tool?.dealloc?.();
    this.tool?.dealloc?.();
    this.#unbindFromViewports.forEach(unbind => unbind());
    this.#unbindFromViewports.clear();
  }

  setToolWithName(name: string): void {
    // cleanup previous tool
    this.unbindTool();
    // get next tool
    const tool = Tools[name];
    if (!tool) {
      console.warn(`no tool with the name ${name}`);
      return;
    }
    // this.#tool = new tool();
    this.tool = new tool();
    // console.log(this.tool);
    this.#ui.viewportManager.viewports.forEach(viewport => {
      // const unbind = this.#tool?.bindTo(viewport);
      const unbind = this.tool?.bindTo(viewport);
      if (!unbind) { return; }
      this.#unbindFromViewports.set(viewport, unbind);
    });
  }

  viewportDidAdd(viewport: Viewport): void {
    this.viewportDidRemove(viewport);
    // const unbind = this.#tool?.bindTo(viewport);
    const unbind = this.tool?.bindTo(viewport);
    if (!unbind) { return; }
    this.#unbindFromViewports.set(viewport, unbind);
  }

  viewportDidRemove(viewport: Viewport): void {
    const unbind = this.#unbindFromViewports.get(viewport);
    if (!unbind) { return; }
    unbind();
    this.#unbindFromViewports.delete(viewport);
  }
}
