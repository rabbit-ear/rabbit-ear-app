import type { UI } from "./UI.svelte";
import type { Viewport } from "./viewports/Viewport.ts";
import type { Tool } from "./tools/Tool.ts";
import Tools from "./tools/index.ts";

export class ToolManager {
  private ui: UI;
  private tool?: Tool = $state();

  toolName: string = $derived((this.tool?.constructor as typeof Tool).key ?? "");

  private unbindFromViewports: Map<Viewport, () => void> = new Map();

  constructor(ui: UI) {
    this.ui = ui;
  }

  dealloc(): void {
    // todo: anything we need to do here?
  }

  get activeTool(): Tool | undefined { return this.tool; }

  getTool() { return this.tool; }

  unbindTool() {
    this.tool?.dealloc?.();
    this.unbindFromViewports.forEach(unbind => unbind());
    this.unbindFromViewports.clear();
  }

  setToolWithName(name: string) {
    // cleanup previous tool
    this.unbindTool();
    // get next tool
    const tool = Tools[name];
    if (!tool) {
      console.warn(`no tool with the name ${name}`);
      return;
    }
    this.tool = new tool();
    // console.log(this.tool);
    this.ui.viewportManager.viewports.forEach(viewport => {
      const unbind = this.tool?.bindTo(viewport);
      if (!unbind) { return; }
      this.unbindFromViewports.set(viewport, unbind);
    });
  }

  viewportDidAdd(viewport: Viewport) {
    this.viewportDidRemove(viewport);
    const unbind = this.tool?.bindTo(viewport);
    if (!unbind) { return; }
    this.unbindFromViewports.set(viewport, unbind);
  }

  viewportDidRemove(viewport: Viewport) {
    const unbind = this.unbindFromViewports.get(viewport);
    if (!unbind) { return; }
    unbind();
    this.unbindFromViewports.delete(viewport);
  }
}
