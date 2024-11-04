import type { Component } from "svelte";
import type { UI } from "../UI.svelte.ts";
import type { IViewport, IModelViewport } from "../viewport/viewport.ts";
//import { ViewportStatics } from "./viewport/viewport.ts";
import AppPanel from "./AppPanel.svelte";
// hard-coded viewports, need to somehow auto-place them into the correct location
import { TerminalViewport } from "../viewport/TerminalViewport/TerminalViewport.svelte.ts";
import { FramesViewport } from "../viewport/FramesViewport/FramesViewport.svelte.ts";
import type { SVGViewport } from "../viewport/SVGViewport/SVGViewport.svelte.ts";
import type { WebGLViewport } from "../viewport/WebGLViewport/WebGLViewport.svelte.ts";
import type { SimulatorViewport } from "../viewport/SimulatorViewport/SimulatorViewport.svelte.ts";
//import { ScriptViewport } from "../viewport/ScriptViewport/ScriptViewport.svelte.ts";

// compares their constructors with ===
const uniqueObjects = <T>(objs: T[]): T[] => {
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

export class PanelsManager {
  ui: UI;

  constructor(ui: UI) {
    this.ui = ui;
  }

  // all viewports currently active, but only one instance of each.
  // for example. multiple SVGViewports on screen but will only appear once
  //modelViewportClasses: { new (): IModelViewport }[] = $derived.by(() =>
  modelViewportClasses: (SVGViewport | WebGLViewport | SimulatorViewport)[] = $derived.by(
    () => uniqueObjects(this.ui.viewports.modelViewports).map((el) => el.constructor),
  );

  //terminalViewportClass: IViewport | undefined = $derived(() =>
  terminalViewportClass: typeof TerminalViewport | undefined = $derived.by(() =>
    this.ui.viewports.terminal ? TerminalViewport : undefined,
  );

  //framesViewportClass: IViewport | undefined = $derived.by(() =>
  framesViewportClass: IViewport | undefined = $derived.by(() =>
    this.ui.viewports.frames ? (FramesViewport as IViewport) : undefined,
  );

  builtinViewportClasses: IViewport[] = $derived.by(() =>
    [this.terminalViewportClass, this.framesViewportClass].filter((a) => a !== undefined),
  );

  viewportClasses: IViewport[] = $derived.by(() =>
    this.modelViewportClasses
      .concat(this.builtinViewportClasses)
      .filter((a) => a !== undefined),
  );

  viewportPanels: [Component, object][] = $derived.by(() =>
    this.viewportClasses
      .map((el) => [el?.panel, { name: el?.name }])
      .filter(([panel]) => panel !== undefined),
  );

  //appPanels: Component[] = [makeAppPanel()];
  appPanels: [Component, object][] = [[AppPanel, { name: "App" }]];

  toolPanels: [Component, object][] = $derived.by(() =>
    this.ui.tool?.panel !== undefined
      ? [[this.ui.tool?.panel, { name: this.ui.tool?.constructor.name }]]
      : [],
  );

  //#viewportPanels: Component[] = $derived(
  //  [this.framesViewport, this.terminalViewport, ...this.#uniqueViewports]
  //    //.map((view) => (view?.constructor as typeof ViewportStatics)?.panel)
  //    .map((view) => view?.constructor?.panel)
  //    .concat([this.#tool?.panel])
  //    .filter((a) => a !== undefined),
  //);

  zipped: [Component, object][] = $derived.by(() =>
    this.appPanels.concat(this.toolPanels).concat(this.viewportPanels),
  );

  components: Component[] = $derived(this.zipped.map(([panel]) => panel));
  props: object[] = $derived(this.zipped.map(([, props]) => props));

  //viewportPanelsAndNames: [Component, string][] = $derived.by(() =>
  //  this.viewportClasses.map((el) => [el?.panel, el?.name])
  //  [this.ui.framesViewport, this.ui.terminalViewport, ...this.uniqueViewports]
  //    //.map((view) => (view?.constructor as typeof ViewportStatics)?.panel)
  //    .map((view) => [view?.constructor?.panel, view?.constructor?.name])
  //    .concat([[this.#tool?.panel, this.#tool?.name]])
  //    .filter(([component]) => component !== undefined),
  //);

  // the complete set of panels are: app-wide panels + viewport panels + tool panels
  //panels: Panel[] = $derived(this.#appPanels.concat(this.#viewportPanels));
  //panels: Component[] = $derived(this.#appPanels.concat(this.#viewportPanels));
  //panelsName: string[] = $derived(this.#appPanelsNames.concat(this.#viewportPanelsNames));
  //panelsProps: object[] = $derived(
  //  this.panels.map(() => ({ getName: () => "test name" })),
  //);

  dealloc(): void {
    // empty
  }
}
