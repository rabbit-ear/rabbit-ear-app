import type { Component } from "svelte";
import type { UI } from "../UI.svelte.ts";
import type {
  ViewportClassTypes,
  ModelViewportClassTypes,
} from "../viewport/viewports.ts";
import AppPanel from "./AppPanel/AppPanel.svelte";
import FramesPanel from "./FramesPanel/FramesPanel.svelte";
import { uniqueObjects } from "./arrays.ts";

export class PanelsManager {
  ui: UI;

  constructor(ui: UI) {
    this.ui = ui;
  }

  // all viewports currently active, but only one instance of each.
  // for example. multiple SVGViewports on screen but will only appear once
  modelViewportClasses: ModelViewportClassTypes[] = $derived.by(() =>
    uniqueObjects(this.ui.viewports.modelViewports)
      .map((el) => el.constructor as ModelViewportClassTypes)
      .filter((a) => a !== undefined),
  );

  terminalViewportClass: ViewportClassTypes | undefined = $derived.by(
    () => this.ui.viewports.terminal?.constructor as ViewportClassTypes,
  );

  framesViewportClass: ViewportClassTypes | undefined = $derived.by(
    () => this.ui.viewports.frames?.constructor as ViewportClassTypes,
  );

  builtinViewportClasses: ViewportClassTypes[] = $derived.by(() =>
    [this.terminalViewportClass, this.framesViewportClass].filter((a) => a !== undefined),
  );

  viewportClasses: ViewportClassTypes[] = $derived.by(() =>
    ([] as ViewportClassTypes[])
      .concat(this.modelViewportClasses)
      .concat(this.builtinViewportClasses),
  );

  makeObj(name?: string): object {
    return { name: name || "" };
  }

  viewportPanelsWithUndefineds: [Component, object][] = $derived.by(() =>
    this.viewportClasses.map((el) => [el?.panel, { name: el?.name } as object]),
  );

  viewportPanels: [Component, object][] = $derived.by(() =>
    this.viewportPanelsWithUndefineds.filter((el) => el[0] !== undefined),
  );

  //appPanels: Component[] = [makeAppPanel()];
  appPanels: [Component, object][] = [
    [AppPanel, { name: "App" }],
    [FramesPanel, { name: "Frames" }],
  ];

  toolPanels: [Component, object][] = $derived.by(() =>
    this.ui.tool?.panel !== undefined
      ? [[this.ui.tool?.panel, { name: this.ui.tool?.constructor.name }]]
      : [],
  );

  zipped: [Component, object][] = $derived.by(() =>
    this.appPanels.concat(this.toolPanels).concat(this.viewportPanels),
  );

  components: Component[] = $derived(this.zipped.map(([panel]) => panel));
  props: object[] = $derived(this.zipped.map(([, props]) => props));

  dealloc(): void {
    // empty
  }
}
