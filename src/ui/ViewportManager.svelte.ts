// import { untrack } from "svelte";
import type { UI } from "./UI.svelte.ts";
import type { Viewport } from "./viewports/Viewport.ts";
import Viewports from "./viewports/index.ts";

// Event handlers are typed with their event object as either:
// MouseEvent, TouchEvent, WheelEvent, or KeyboardEvent
// which are types of Event.
// Using this to silence a typescript warning.
type EH = (e: Event) => void;

export class ViewportManager {
  ui: UI;
  #effects: (() => void)[] = [];

  viewports: Viewport[] = $state([]);

  // activeViewport: Viewport | undefined = $state(undefined);

  viewportEvents: Map<Viewport, { [key: string]: EH }> = new Map();

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

  addViewport(viewport: Viewport) {
    // this block needs to happen once viewport.domElement exists,
    // which only happens after Svelte mounts, via this callback didMount.
    viewport.didMount = () => {
      console.log("viewport did mount callback, mounting.");
      this.unbindViewport(viewport);
      this.bindViewport(viewport);
      // viewport.didMount = undefined;
    }
    this.viewports.push(viewport);
    this.ui.toolManager.viewportDidAdd(viewport);
  }

  removeViewport(viewport: Viewport) {
    const index = this.viewports.indexOf(viewport);
    // const index = this.viewports.findIndex(vp => vp === viewport);
    if (index === -1) { return; }
    // console.log(`ViewportManager removing viewport at index ${index}`);
    this.unbindViewport(viewport);
    this.viewports.splice(index, 1);
    // todo: should this be moved above the removal and be called WillRemove?
    // this.ui.toolManager.viewportDidRemove(viewport);
  }

  replaceViewport(index: number, ViewportClass: Viewport) {
    // removeViewportAtIndex(index);
  }

  // setActiveViewport(viewport: Viewport) {
  //   this.activeViewport = viewport;
  //   // this.ui.emit("activeViewportChange", viewport);
  // }

  unbindViewport(viewport: Viewport) {
    const prevEvents = this.viewportEvents.get(viewport);
    if (prevEvents) {
      Object.keys(prevEvents)
        .forEach(key => viewport.domElement?.removeEventListener(key, prevEvents[key]));
      this.viewportEvents.delete(viewport);
    } else {
      // console.log("  - no events found");
    }
  }

  bindViewport(viewport: Viewport) {
    // console.log("ViewportManager bindViewport()");
    // console.log("ToolManager bindViewport() domElement", viewport, viewport.domElement);
    // const events: {[key: string]: (e: Event) => void } = {
    if (!viewport.domElement) { return; }

    // todo: bring this back after debuggin
    // this.unbindViewport(viewport);

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

