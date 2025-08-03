// import { untrack } from "svelte";
import type { UI } from "./UI.svelte.ts";
// import type { ModelViewportType } from "../ui/viewports/types.ts";
import type { Viewport } from "./viewports/Viewport.ts";
// import { ModelViewports } from "./viewports.ts";
// import { TerminalViewport } from "./TerminalViewport/TerminalViewport.svelte.ts";
// import { ScriptViewport } from "./ScriptViewport/ScriptViewport.svelte.ts";

// Event handlers are typed with their event object as either:
// MouseEvent, TouchEvent, WheelEvent, or KeyboardEvent
// which are types of Event.
// Using this to silence a typescript warning.
type EH = (e: Event) => void;

export class ViewportManager {
  ui: UI;
  #effects: (() => void)[] = [];

  viewports: Viewport[] = $state([]);

  activeViewport: Viewport | undefined = $state(undefined);

  viewportEvents: Map<Viewport, { [key: string]: EH }> = new Map();

  // can be included in viewports, but we need to figure out
  // how to auto-place them in their correct location on screen
  // terminal?: TerminalViewport;

  // #makeToolViewportEffect = (): (() => void) =>
  //   $effect.root(() => {
  //     $effect(() => {
  //       this.viewports.forEach((viewport) => viewport.unbindTool());
  //       this.viewports.forEach((viewport) => this.ui.tool?.bindTo(viewport));
  //     });
  //     return () => {
  //       this.viewports.forEach((viewport) => viewport.unbindTool());
  //     };
  //   });

  #triggerViewportRedraw = (): (() => void) =>
    $effect.root(() => {
      $effect(() => {
        this.viewports.forEach((viewport) => viewport.redraw?.());
      });
      return () => {
        // empty
      };
    });

  constructor(ui: UI) {
    this.ui = ui;
    // this.#effects = [this.#triggerViewportRedraw(), this.#makeToolViewportEffect()];
    this.#effects = [this.#triggerViewportRedraw()];
    // this.addViewport(new FilesViewport());
    // this.terminal = new TerminalViewport();
    //this.frames = new FramesViewport();
  }

  // add(ViewClass?: ModelViewportType): void {
  //   if (!ViewClass) {
  //     // this.viewports.push(new ModelViewports[0]());
  //   } else {
  //     this.viewports.push(new ViewClass());
  //   }
  // }

  addViewport(viewport: Viewport) {
    console.log("add viewport", viewport);

    viewport.didMount = () => {
      console.log("viewport did mount callback, mounting.");
      this.unbindViewport(viewport);
      this.bindViewport(viewport);
      // viewport.didMount = undefined;
    }
    this.viewports.push(viewport);
    this.ui.toolManager.getTool()?.bindTo(viewport);
    this.ui.toolManager.viewportDidAdd(viewport);

    // this.bindViewport(viewport);
    // setTimeout(() => this.bindViewport(viewport), 200);
    // this.ui.toolManager.registerViewport(viewport);
  }

  removeViewport(viewport: Viewport) {
    const index = this.viewports.indexOf(viewport);
    if (index === -1) { return; }
    this.unbindViewport(viewport);
    this.viewports.splice(index, 1);
    // todo: should this be moved above the removal and be called WillRemove?
    this.ui.toolManager.viewportDidRemove(viewport);
  }

  setActiveViewport(viewport: Viewport) {
    this.activeViewport = viewport;
    // this.ui.emit("activeViewportChange", viewport);
  }

  unbindViewport(viewport: Viewport) {
    console.log("ToolManager unbindViewport()");
    const prevEvents = this.viewportEvents.get(viewport);
    if (prevEvents) {
      console.log("events found");
      // console.log(prevEvents);
      Object.keys(prevEvents)
        .forEach(key => viewport.domElement?.removeEventListener(key, prevEvents[key]));
    } else {
      console.log("no events found");
    }
    this.viewportEvents.delete(viewport);
  }

  bindViewport(viewport: Viewport) {
    console.log("ToolManager bindViewport()");
    // console.log("ToolManager bindViewport() domElement", viewport, viewport.domElement);
    // const events: {[key: string]: (e: Event) => void } = {
    if (!viewport.domElement) { return; }

    this.unbindViewport(viewport);

    // const tm = this.ui.toolManager;
    const events: { [key: string]: EH } = {
      mousemove: ((e: MouseEvent) => this.ui.toolManager.getTool()?.onmousemove?.(viewport, e)) as EH,
      mousedown: ((e: MouseEvent) => this.ui.toolManager.getTool()?.onmousedown?.(viewport, e)) as EH,
      mouseup: ((e: MouseEvent) => this.ui.toolManager.getTool()?.onmouseup?.(viewport, e)) as EH,
      mouseleave: ((e: MouseEvent) => this.ui.toolManager.getTool()?.onmouseleave?.(viewport, e)) as EH,
      wheel: ((e: WheelEvent) => this.ui.toolManager.getTool()?.onwheel?.(viewport, e)) as EH,
      touchstart: ((e: TouchEvent) => this.ui.toolManager.getTool()?.ontouchstart?.(viewport, e)) as EH,
      touchend: ((e: TouchEvent) => this.ui.toolManager.getTool()?.ontouchend?.(viewport, e)) as EH,
      touchmove: ((e: TouchEvent) => this.ui.toolManager.getTool()?.ontouchmove?.(viewport, e)) as EH,
      touchcancel: ((e: TouchEvent) => this.ui.toolManager.getTool()?.ontouchcancel?.(viewport, e)) as EH,
      keydown: ((e: KeyboardEvent) => this.ui.toolManager.getTool()?.onkeydown?.(viewport, e)) as EH,
      keyup: ((e: KeyboardEvent) => this.ui.toolManager.getTool()?.onkeyup?.(viewport, e)) as EH,
    };

    // console.log(events);

    this.viewportEvents.set(viewport, events);
    Object.keys(events).forEach(key => viewport.domElement?.addEventListener(key, events[key]));
    // Object.keys(events).forEach(key => console.log("add event listener", key, events[key]));
  }

  // bindViewport(viewport: Viewport) {
  //   if (!this.ui.toolManager.getTool() || !viewport.domElement) { return; }
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

  // replace(index: number, ViewClass: ModelViewportClassTypes): void {
  //   this.modelViewports
  //     .splice(index, 1, new ViewClass())
  //     .forEach((viewport) => viewport?.dealloc());
  // }

  // remove(index?: number): void {
  //   if (index === undefined) {
  //     this.modelViewports.pop()?.dealloc();
  //   } else {
  //     this.modelViewports.splice(index, 1).forEach((viewport) => viewport?.dealloc());
  //   }
  // }

  resetCameras(): void {
    this.viewports
      .filter(viewport => typeof viewport.resetView === "function")
      .forEach((viewport) => viewport.resetView());
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.#effects.forEach((cleanup) => cleanup());
  }
}

