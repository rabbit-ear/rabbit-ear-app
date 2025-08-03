import { ViewportManager } from "./ViewportManager.svelte.ts";
import { ToolManager } from "./ToolManager.svelte.ts";
import { storageKeys, getStorageBoolean } from "../app/localStorage.svelte.ts";
import { PanelManager } from "./PanelManager.svelte.ts";

export class UI {
  viewportManager: ViewportManager;
  toolManager: ToolManager;
  panelManager: PanelManager;

  // if the X axis is to the right, is the Y axis up (right handed) or down (left).
  // is the Y axis on top (true) or on bottom (false)?
  rightHanded: boolean = $state(getStorageBoolean(storageKeys.rightHanded, true));

  // custom effect.root will be unbound when this component is deallocated
  unbind: (() => void)[] = [];

  constructor() {
    this.viewportManager = new ViewportManager(this);
    this.toolManager = new ToolManager(this);
    this.panelManager = new PanelManager(this);
    this.unbind = [this.#bindToLocalStorage()];
  }

  #bindToLocalStorage(): () => void {
    return $effect.root(() => {
      $effect(() => {
        localStorage.setItem(storageKeys.rightHanded, String(this.rightHanded));
      });
      return () => { };
    });
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.viewportManager.dealloc();
    this.panelManager.dealloc();
    this.toolManager.dealloc();
    this.unbind.forEach((fn) => fn());
  }
};

