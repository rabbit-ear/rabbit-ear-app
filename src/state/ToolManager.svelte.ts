// import type { UITool } from "./tools/UITool.ts";
// import Tools from "./tools/index.ts";
import type { UI } from "./UI.svelte";
import type { Viewport } from "../ui/viewports/Viewport.ts";
import type { Tool } from "../ui/tools/Tool.ts";

// Event handlers are typed with their event object as either:
// MouseEvent, TouchEvent, WheelEvent, or KeyboardEvent
// which are types of Event.
// Using this to silence a typescript warning.
type EventHandler = (e: Event) => void;

export class ToolManager {
  ui: UI;
  // tool: string = $state("");
  private tool?: Tool = $state();

  constructor(ui: UI) {
    this.ui = ui;
  }

  bindViewport(viewport: Viewport) {
    const onmousemove = (e: MouseEvent) => this.tool?.onmousemove?.(viewport, e);
    const onmousedown = (e: MouseEvent) => this.tool?.onmousedown?.(viewport, e);
    const onmouseup = (e: MouseEvent) => this.tool?.onmouseup?.(viewport, e);
    const onmouseleave = (e: MouseEvent) => this.tool?.onmouseleave?.(viewport, e);
    const onwheel = (e: WheelEvent) => this.tool?.onwheel?.(viewport, e);
    const ontouchstart = (e: TouchEvent) => this.tool?.ontouchstart?.(viewport, e);
    const ontouchend = (e: TouchEvent) => this.tool?.ontouchend?.(viewport, e);
    const ontouchmove = (e: TouchEvent) => this.tool?.ontouchmove?.(viewport, e);
    const ontouchcancel = (e: TouchEvent) => this.tool?.ontouchcancel?.(viewport, e);
    const onkeydown = (e: KeyboardEvent) => this.tool?.onkeydown?.(viewport, e);
    const onkeyup = (e: KeyboardEvent) => this.tool?.onkeyup?.(viewport, e);

    viewport.domElement?.addEventListener("onmousemove", onmousemove as EventHandler);
    viewport.domElement?.addEventListener("onmousedown", onmousedown as EventHandler);
    viewport.domElement?.addEventListener("onmouseup", onmouseup as EventHandler);
    viewport.domElement?.addEventListener("onmouseleave", onmouseleave as EventHandler);
    viewport.domElement?.addEventListener("onwheel", onwheel as EventHandler);
    viewport.domElement?.addEventListener("ontouchstart", ontouchstart as EventHandler);
    viewport.domElement?.addEventListener("ontouchend", ontouchend as EventHandler);
    viewport.domElement?.addEventListener("ontouchmove", ontouchmove as EventHandler);
    viewport.domElement?.addEventListener("ontouchcancel", ontouchcancel as EventHandler);
    viewport.domElement?.addEventListener("onkeydown", onkeydown as EventHandler);
    viewport.domElement?.addEventListener("onkeyup", onkeyup as EventHandler);
  }

  setTool(tool: Tool) {
    this.tool = tool;
    this.ui.viewportManager.viewports.forEach(viewport => tool.bindTo(viewport));
  }

  getTool() { return this.tool; }

  private handleHover(event: PointerEvent, viewport: Viewport) {

  }

  private dispatchToActiveTool(kind: "press" | "move" | "release", event: PointerEvent, viewport: Viewport) {
    if (!this.tool) { return; }
    // const handlerName = `on${capitalize(kind)}${type}` as keyof Tool;
    // (tool[handlerName] as any)?.call(tool, e, vp, this.ctx);
  }
}
