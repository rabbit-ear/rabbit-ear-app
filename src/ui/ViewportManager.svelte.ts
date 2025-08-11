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
  viewportEvents: Map<Viewport, { [key: string]: EH }> = new Map();

  #triggerViewportRedraw = (): (() => void) =>
    $effect.root(() => {
      $effect(() => {
        this.viewports.forEach((viewport) => viewport.redraw?.());
      });
      // empty
      return () => { };
    });

  constructor(ui: UI) {
    this.ui = ui;
    this.#effects = [this.#triggerViewportRedraw()];
    // this.terminal = new TerminalViewport();
  }

  addViewport(viewport: Viewport): void {
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

  addViewportWithName(name: string): void {
    const ViewportClass = Viewports[name];
    if (!ViewportClass) { return; }
    const viewport = new ViewportClass();
    if (!viewport) { return; }
    this.addViewport(viewport);
  }

  removeViewport(viewport: Viewport): void {
    const index = this.viewports.indexOf(viewport);
    if (index === -1) { return; }
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
      console.log("events found", Object.keys(prevEvents));
      Object.keys(prevEvents)
        .forEach(key => viewport.domElement?.removeEventListener(key, prevEvents[key]));
      this.viewportEvents.delete(viewport);
    } else {
      console.log("  - no events found");
    }
  }

  bindViewport(viewport: Viewport) {
    if (!viewport.domElement) { return; }

    // viewports should only have one of each event bound to it.
    // as a safety precaution, remove any events if they exist.
    // so far this case has never been observed, it's simply preventative.
    this.unbindViewport(viewport);

    const events: { [key: string]: EH } = {
      mousemove: ((e: MouseEvent) => this.ui.toolManager.tool?.onmousemove?.(viewport, e)) as EH,
      mousedown: ((e: MouseEvent) => this.ui.toolManager.tool?.onmousedown?.(viewport, e)) as EH,
      mouseup: ((e: MouseEvent) => this.ui.toolManager.tool?.onmouseup?.(viewport, e)) as EH,
      mouseleave: ((e: MouseEvent) => this.ui.toolManager.tool?.onmouseleave?.(viewport, e)) as EH,
      wheel: ((e: WheelEvent) => this.ui.toolManager.tool?.onwheel?.(viewport, e)) as EH,
      touchstart: ((e: TouchEvent) => this.ui.toolManager.tool?.ontouchstart?.(viewport, e)) as EH,
      touchend: ((e: TouchEvent) => this.ui.toolManager.tool?.ontouchend?.(viewport, e)) as EH,
      touchmove: ((e: TouchEvent) => this.ui.toolManager.tool?.ontouchmove?.(viewport, e)) as EH,
      touchcancel: ((e: TouchEvent) => this.ui.toolManager.tool?.ontouchcancel?.(viewport, e)) as EH,
      keydown: ((e: KeyboardEvent) => this.ui.toolManager.tool?.onkeydown?.(viewport, e)) as EH,
      keyup: ((e: KeyboardEvent) => this.ui.toolManager.tool?.onkeyup?.(viewport, e)) as EH,
    };

    this.viewportEvents.set(viewport, events);
    Object.keys(events).forEach(key => viewport.domElement?.addEventListener(key, events[key]));
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
      // .filter(viewport => typeof viewport.view.reset === "function")
      .forEach((viewport) => viewport.view.reset());
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.#effects.forEach((cleanup) => cleanup());
  }
}

