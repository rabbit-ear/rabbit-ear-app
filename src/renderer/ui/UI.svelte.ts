import { untrack } from "svelte";
import type { UITool } from "./UITool.ts";
import type { Viewport } from "./viewport/viewport.ts";
import { ViewportStatics } from "./viewport/viewport.ts";
import type { Panel } from "./panel/panel.ts";
import Tools from "./tools/index.ts";
import { SVGViewport } from "./viewport/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "./viewport/WebGLViewport/WebGLViewport.svelte.ts";
import { SimulatorViewport } from "./viewport/SimulatorViewport/SimulatorViewport.svelte.ts";
import { ScriptViewport } from "./viewport/ScriptViewport/ScriptViewport.svelte.ts";
// panels
import AppPanel from "./panel/AppPanel.svelte";
// hard-coded viewports, need to somehow auto-place them into the correct location
import { TerminalViewport } from "./viewport/TerminalViewport/TerminalViewport.svelte.ts";
import { FramesViewport } from "./viewport/FramesViewport/FramesViewport.svelte.ts";

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

const makeAppPanel = (): Panel => {
  class AppClass implements Panel {
    title = "App";
    component = AppPanel;
  }
  return new AppClass();
};

export class UI {
  viewports: Viewport[] = $state([]);
  #tool: UITool | undefined = $state();
  #effects: (() => void)[] = [];

  // can be included in viewports, but we need to figure out
  // how to auto-place them in their correct location on screen
  terminalViewport?: TerminalViewport;
  framesViewport?: FramesViewport;

  // all viewports currently active, but only one instance of each.
  // for example. multiple SVGViewports on screen but will only appear once
  #uniqueViewports: Viewport[] = $derived(uniqueObjects(this.viewports));

  #appPanels: Panel[] = [makeAppPanel()];

  #viewportPanels: Panel[] = $derived(
    [this.framesViewport, this.terminalViewport, ...this.#uniqueViewports]
      .map((view) => (view?.constructor as typeof ViewportStatics)?.panel)
      .concat([this.#tool?.panel])
      .filter((a) => a !== undefined),
  );

  // the complete set of panels are: app-wide panels + viewport panels + tool panels
  panels: Panel[] = $derived(this.#appPanels.concat(this.#viewportPanels));

  get tool(): UITool | undefined {
    return this.#tool;
  }
  // no need to set the tool directly. use a string ("line", "zoom"), the tool's name.
  // if no tool matches the string, the tool will become unset (undefined).
  setToolName(name: string): void {
    this.#tool?.dealloc();
    const NewTool: typeof UITool | undefined = Tools[name];
    // @ts-ignore - UITool is abstract, but none of these are UITools, ignore warning.
    this.#tool = NewTool === undefined ? undefined : new NewTool();
  }

  #makeToolViewportEffect = (): (() => void) =>
    $effect.root(() => {
      $effect(() => {
        this.viewports.forEach((viewport) => viewport.dealloc());
        this.viewports.forEach((viewport) => this.tool?.bindTo(viewport));
      });
      return () => {
        this.viewports.forEach((viewport) => viewport.dealloc());
      };
    });

  #triggerViewportRedraw = (): (() => void) =>
    $effect.root(() => {
      $effect(() => {
        this.viewports.forEach((viewport) => viewport.redraw?.());
      });
      return () => {
        // empty
      };
    });

  constructor() {
    this.#effects = [this.#triggerViewportRedraw(), this.#makeToolViewportEffect()];
    this.terminalViewport = new TerminalViewport();
    this.framesViewport = new FramesViewport();
  }

  // manage viewport array

  addViewport(
    ViewClass?: typeof SVGViewport | typeof WebGLViewport | typeof SimulatorViewport,
  ): void {
    if (!ViewClass) {
      this.viewports.push(new SVGViewport());
    } else {
      this.viewports.push(new ViewClass());
    }
  }

  swapViewport(
    index: number,
    ViewClass: typeof SVGViewport | typeof WebGLViewport | typeof SimulatorViewport,
  ): void {
    this.viewports.splice(index, 1, new ViewClass());
  }

  removeViewport(index?: number): void {
    if (index === undefined) {
      this.viewports.pop();
    } else {
      this.viewports.splice(index, 1);
    }
  }

  addScriptViewport(): void {
    this.viewports.push(new ScriptViewport());
  }

  showScriptViewport(visible: boolean): void {
    untrack(() => {
      if (visible) {
        this.viewports = this.viewports
          .filter((view) => view.constructor !== ScriptViewport)
          .concat([new ScriptViewport()]);
      } else {
        this.viewports = this.viewports.filter(
          (view) => view.constructor !== ScriptViewport,
        );
      }
    });
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.#effects.forEach((cleanup) => cleanup());
  }
}
