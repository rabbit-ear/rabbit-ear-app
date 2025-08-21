import { ViewportManager } from "./ViewportManager.svelte.ts";
import { ToolManager } from "./ToolManager.svelte.ts";
import { PanelManager } from "./PanelManager.svelte.ts";
import { Settings } from "./Settings.svelte.ts";
import context from "../app/context.svelte.ts";
import { UIMode } from "./Settings.svelte.ts";

export class UI {
  viewportManager: ViewportManager;
  toolManager: ToolManager;
  panelManager: PanelManager;
  settings: Settings;

  #effects: (() => void)[] = [];

  constructor() {
    this.viewportManager = new ViewportManager(this);
    this.toolManager = new ToolManager(this);
    this.panelManager = new PanelManager(this);
    this.settings = new Settings();
    this.#effects = [this.#effectUIMode()];
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.viewportManager.dealloc();
    this.panelManager.dealloc();
    this.toolManager.dealloc();
    this.#effects.forEach(fn => fn());
  }

  #effectUIMode(): () => void {
    return $effect.root(() => {
      $effect(() => {
        switch (this.settings.mode) {
          case UIMode.mesh: context.keyboardManager.setActiveKeymap("meshMode"); break;
          case UIMode.ruler: context.keyboardManager.setActiveKeymap("rulerMode"); break;
        }
      });
      return () => { };
    })
  }
};

