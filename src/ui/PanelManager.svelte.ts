import type { Component } from "svelte";
import type { UI } from "./UI.svelte.ts";
import type { Viewport } from "./viewports/Viewport.ts";
import AppPanels from "./panels/index.ts";
import t from "../app/t.ts";

type PanelType = { name: string; component: Component; };

export class PanelManager {
  ui: UI;

  constructor(ui: UI) {
    this.ui = ui;
  }

  // these are the static member property "panel"
  // all viewports currently active, but only one instance of each.
  // for example. multiple SVGViewports on screen but will only appear once
  viewportPanels: PanelType[] = $derived
    .by(() => Array.from(new Set(this.ui.viewportManager.viewports
      .map(viewport => viewport.constructor as typeof Viewport)))
      .map(ViewportClass => ({ name: ViewportClass.name || "", component: ViewportClass.panel }))
      .filter(obj => obj.component !== undefined));

  toolPanel: PanelType | undefined = $derived.by(() => this.ui.toolManager.tool?.panel
    ? ({
      name: this.ui.toolManager.tool?.constructor.name,
      component: this.ui.toolManager.tool?.panel,
    })
    : undefined);

  panels: PanelType[] = $derived(([] as PanelType[])
    .concat([this.toolPanel].filter(a => a !== undefined))
    .concat(AppPanels)
    .concat(this.viewportPanels));

  // terminalViewportClass: ViewportClassTypes | undefined = $derived.by(
  //   () => this.ui.viewports.terminal?.constructor as ViewportClassTypes,
  // );

  // builtinViewportClasses: ViewportClassTypes[] = $derived.by(() =>
  //   [this.terminalViewportClass].filter((a) => a !== undefined),
  // );

  // empty
  dealloc(): void { }
}

