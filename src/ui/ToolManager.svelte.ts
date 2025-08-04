import type { UI } from "./UI.svelte";
import type { Viewport } from "./viewports/Viewport.ts";
import type { Tool } from "./tools/Tool.ts";
import Tools from "./tools/index.ts";

export class ToolManager {
  ui: UI;
  private tool?: Tool = $state();

  toolName: string = $derived((this.tool?.constructor as typeof Tool).key ?? "");

  // private unbindFromViewports: (() => void)[] = [];
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
    if (!tool) { return; }
    this.tool = new tool();
    // console.log(this.tool);
    console.log(`ToolManager binding to ${this.ui.viewportManager.viewports.length} viewports`)
    this.ui.viewportManager.viewports.forEach(viewport => {
      const unbind = this.tool?.bindTo(viewport);
      if (!unbind) { return; }
      console.log(" - adding unbind method");
      this.unbindFromViewports.set(viewport, unbind);
    });
  }

  viewportDidAdd(viewport: Viewport) {
    console.log("ToolManager viewportDidAdd()");
    this.viewportDidRemove(viewport);
    const unbind = this.tool?.bindTo(viewport);
    if (!unbind) { return; }
    this.unbindFromViewports.set(viewport, unbind);
  }

  viewportDidRemove(viewport: Viewport) {
    console.log("ToolManager viewportDidRemove()");
    const unbind = this.unbindFromViewports.get(viewport);
    if (!unbind) { return; }
    unbind();
    this.unbindFromViewports.delete(viewport);
  }

  // bindViewport(viewport: Viewport) {
  //   if (!this.tool || !viewport.domElement) { return; }
  //   // console.log("ToolManager bindViewport()");
  //   // console.log("ToolManager bindViewport() domElement", viewport.domElement);
  //   const onmousemove = (e: MouseEvent) => this.tool?.onmousemove?.(viewport, e);
  //   const onmousedown = (e: MouseEvent) => this.tool?.onmousedown?.(viewport, e);
  //   const onmouseup = (e: MouseEvent) => this.tool?.onmouseup?.(viewport, e);
  //   const onmouseleave = (e: MouseEvent) => this.tool?.onmouseleave?.(viewport, e);
  //   const onwheel = (e: WheelEvent) => this.tool?.onwheel?.(viewport, e);
  //   const ontouchstart = (e: TouchEvent) => this.tool?.ontouchstart?.(viewport, e);
  //   const ontouchend = (e: TouchEvent) => this.tool?.ontouchend?.(viewport, e);
  //   const ontouchmove = (e: TouchEvent) => this.tool?.ontouchmove?.(viewport, e);
  //   const ontouchcancel = (e: TouchEvent) => this.tool?.ontouchcancel?.(viewport, e);
  //   const onkeydown = (e: KeyboardEvent) => this.tool?.onkeydown?.(viewport, e);
  //   const onkeyup = (e: KeyboardEvent) => this.tool?.onkeyup?.(viewport, e);
  //
  //   viewport.domElement?.addEventListener("mousemove", onmousemove as EventHandler);
  //   viewport.domElement?.addEventListener("mousedown", onmousedown as EventHandler);
  //   viewport.domElement?.addEventListener("mouseup", onmouseup as EventHandler);
  //   viewport.domElement?.addEventListener("mouseleave", onmouseleave as EventHandler);
  //   viewport.domElement?.addEventListener("wheel", onwheel as EventHandler);
  //   viewport.domElement?.addEventListener("touchstart", ontouchstart as EventHandler);
  //   viewport.domElement?.addEventListener("touchend", ontouchend as EventHandler);
  //   viewport.domElement?.addEventListener("touchmove", ontouchmove as EventHandler);
  //   viewport.domElement?.addEventListener("touchcancel", ontouchcancel as EventHandler);
  //   viewport.domElement?.addEventListener("keydown", onkeydown as EventHandler);
  //   viewport.domElement?.addEventListener("keyup", onkeyup as EventHandler);
  // }

  // unbindViewport(viewport: Viewport) {
  //   viewport.domElement?.removeEventListener("mousemove", onmousemove as EventHandler);
  //   viewport.domElement?.removeEventListener("mousedown", onmousedown as EventHandler);
  //   viewport.domElement?.removeEventListener("mouseup", onmouseup as EventHandler);
  //   viewport.domElement?.removeEventListener("mouseleave", onmouseleave as EventHandler);
  //   viewport.domElement?.removeEventListener("wheel", onwheel as EventHandler);
  //   viewport.domElement?.removeEventListener("touchstart", ontouchstart as EventHandler);
  //   viewport.domElement?.removeEventListener("touchend", ontouchend as EventHandler);
  //   viewport.domElement?.removeEventListener("touchmove", ontouchmove as EventHandler);
  //   viewport.domElement?.removeEventListener("touchcancel", ontouchcancel as EventHandler);
  //   viewport.domElement?.removeEventListener("keydown", onkeydown as EventHandler);
  //   viewport.domElement?.removeEventListener("keyup", onkeyup as EventHandler);
  // }

  private handleHover(event: PointerEvent, viewport: Viewport) {

  }

  private dispatchToActiveTool(kind: "press" | "move" | "release", event: PointerEvent, viewport: Viewport) {
    if (!this.tool) { return; }
    // const handlerName = `on${capitalize(kind)}${type}` as keyof Tool;
    // (tool[handlerName] as any)?.call(tool, e, vp, this.ctx);
  }
}
