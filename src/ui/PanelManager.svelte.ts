import type { Component } from "svelte";
import type { UI } from "./UI.svelte.ts";
import type { Viewport } from "./viewports/Viewport.ts";
import AppPanels from "./panels/index.ts";

// todo: try to replace this with a Set
// compares their constructors with ===
export const uniqueObjects = <T>(objs: T[]): T[] => {
  const result: T[] = [];
  objs.forEach((view, a) => {
    for (let b = 0; b < a; b += 1) {
      if (view.constructor === objs[b].constructor) {
        return;
      }
    }
    result.push(view);
  });
  return result;
};

type PanelType = { name: string; component: Component; };

export class PanelManager {
  ui: UI;

  constructor(ui: UI) {
    this.ui = ui;
  }

  // these are the static member property "panel"
  // all viewports currently active, but only one instance of each.
  // for example. multiple SVGViewports on screen but will only appear once
  viewportPanels: PanelType[] = $derived.by(() => uniqueObjects(this.ui.viewportManager.viewports
    .map(viewport => viewport.constructor as typeof Viewport)
    .map(ViewportClass => ({ name: ViewportClass.name || "", component: ViewportClass.panel }))
    .filter(obj => obj.component !== undefined)));

  toolPanel: PanelType | undefined = $derived.by(() => this.ui.toolManager.activeTool?.panel
    ? ({ name: this.ui.toolManager.activeTool?.constructor.name, component: this.ui.toolManager.activeTool?.panel })
    : undefined);

  panels: PanelType[] = $derived(this.viewportPanels
    .concat([this.toolPanel])
    .concat(AppPanels)
    .filter(a => a !== undefined));

  // terminalViewportClass: ViewportClassTypes | undefined = $derived.by(
  //   () => this.ui.viewports.terminal?.constructor as ViewportClassTypes,
  // );
  //
  // builtinViewportClasses: ViewportClassTypes[] = $derived.by(() =>
  //   [this.terminalViewportClass].filter((a) => a !== undefined),
  // );

  dealloc(): void {
    // empty
  }
}

