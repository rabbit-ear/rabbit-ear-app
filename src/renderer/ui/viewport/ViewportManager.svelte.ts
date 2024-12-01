import { untrack } from "svelte";
import type { UI } from "../UI.svelte.ts";
import type { ModelViewportTypes, ModelViewportClassTypes } from "./viewports.ts";
import { ModelViewports } from "./viewports.ts";
import { TerminalViewport } from "./TerminalViewport/TerminalViewport.svelte.ts";
//import { ScriptViewport } from "./ScriptViewport/ScriptViewport.svelte.ts";

export class ViewportManager {
  ui: UI;
  #effects: (() => void)[] = [];

  modelViewports: ModelViewportTypes[] = $state([]);
  // can be included in viewports, but we need to figure out
  // how to auto-place them in their correct location on screen
  terminal?: TerminalViewport;

  #makeToolViewportEffect = (): (() => void) =>
    $effect.root(() => {
      $effect(() => {
        this.modelViewports.forEach((viewport) => viewport.unbindTool());
        this.modelViewports.forEach((viewport) => this.ui.tool?.bindTo(viewport));
      });
      return () => {
        this.modelViewports.forEach((viewport) => viewport.unbindTool());
      };
    });

  #triggerViewportRedraw = (): (() => void) =>
    $effect.root(() => {
      $effect(() => {
        this.modelViewports.forEach((viewport) => viewport.redraw?.());
      });
      return () => {
        // empty
      };
    });

  constructor(ui: UI) {
    this.ui = ui;
    this.#effects = [this.#triggerViewportRedraw(), this.#makeToolViewportEffect()];
    this.terminal = new TerminalViewport();
    //this.frames = new FramesViewport();
  }

  add(ViewClass?: ModelViewportClassTypes): void {
    if (!ViewClass) {
      this.modelViewports.push(new ModelViewports[0]());
    } else {
      this.modelViewports.push(new ViewClass());
    }
  }

  replace(index: number, ViewClass: ModelViewportClassTypes): void {
    this.modelViewports
      .splice(index, 1, new ViewClass())
      .forEach((viewport) => viewport?.dealloc());
  }

  remove(index?: number): void {
    if (index === undefined) {
      this.modelViewports.pop()?.dealloc();
    } else {
      this.modelViewports.splice(index, 1).forEach((viewport) => viewport?.dealloc());
    }
  }

  resetCameras(): void {
    this.modelViewports.forEach((viewport) => viewport.resetView());
  }

  addScriptViewport(): void {
    //this.modelViewports.push(new ScriptViewport());
  }

  showScriptViewport(visible: boolean): void {
    untrack(() => {
      if (visible) {
        //      this.modelViewports = this.modelViewports
        //        .filter((view) => view.constructor !== ScriptViewport)
        //        .concat([new ScriptViewport()]);
      } else {
        //      this.modelViewports = this.modelViewports.filter(
        //        (view) => view.constructor !== ScriptViewport,
        //      );
      }
    });
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.#effects.forEach((cleanup) => cleanup());
  }
}
