// import { untrack } from "svelte";
import type { UI } from "./UI.svelte.ts";
// import type { ModelViewportType } from "../ui/viewports/types.ts";
import type { Viewport } from "../ui/viewports/Viewport.ts";
import { FilesViewport } from "../ui/viewports/FilesViewport/FilesViewport.svelte.ts";
import { SVGViewport } from "../ui/viewports/SVGViewport/SVGViewport.svelte.ts";
// import { ModelViewports } from "./viewports.ts";
// import { TerminalViewport } from "./TerminalViewport/TerminalViewport.svelte.ts";
// import { ScriptViewport } from "./ScriptViewport/ScriptViewport.svelte.ts";

export class ViewportManager {
  ui: UI;
  #effects: (() => void)[] = [];

  viewports: Viewport[] = $state([]);

  activeViewport: Viewport | undefined = $state(undefined);

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
    this.viewports.push(new SVGViewport());
    this.viewports.push(new FilesViewport());
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
    this.viewports.push(viewport);
    this.ui.toolManager.registerViewport(viewport);
    // viewport.domElement?.
  }

  setActiveViewport(viewport: Viewport) {
    this.activeViewport = viewport;
    this.ui.emit("activeViewportChange", viewport);
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

