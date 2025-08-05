import { ViewportManager } from "./ViewportManager.svelte.ts";
import { ToolManager } from "./ToolManager.svelte.ts";
import { PanelManager } from "./PanelManager.svelte.ts";
import { Settings } from "./Settings.svelte.ts";

export class UI {
  viewportManager: ViewportManager;
  toolManager: ToolManager;
  panelManager: PanelManager;
  settings: Settings;

  constructor() {
    this.viewportManager = new ViewportManager(this);
    this.toolManager = new ToolManager(this);
    this.panelManager = new PanelManager(this);
    this.settings = new Settings();
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.viewportManager.dealloc();
    this.panelManager.dealloc();
    this.toolManager.dealloc();
  }
};

