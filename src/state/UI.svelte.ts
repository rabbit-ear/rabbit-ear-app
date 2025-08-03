import { ViewportManager } from "./ViewportManager.svelte.ts";
import { ToolManager } from "./ToolManager.svelte.ts";
import { storageKeys, getStorageBoolean } from "./localStorage.svelte.ts";
// import { PanelsManager } from "./panel/PanelsManager.svelte.ts";

export class UI {
  // tool: string = $state("");
  viewportManager: ViewportManager;
  toolManager: ToolManager;
  // panels: PanelsManager;

  // if the X axis is to the right, is the Y axis up (right handed) or down (left).
  // is the Y axis on top (true) or on bottom (false)?
  rightHanded: boolean = $state(getStorageBoolean(storageKeys.rightHanded, true));

  // custom effect.root will be unbound when this component is deallocated
  unbind: (() => void)[] = [];

  // #tool: UITool | undefined = $state();
  //
  // get tool(): UITool | undefined {
  //   return this.#tool;
  // }
  //
  // // no need to set the tool directly. use a string ("line", "zoom"), the tool's name.
  // // if no tool matches the string, the tool will become unset (undefined).
  // setToolName(name: string): void {
  //   this.#tool?.dealloc();
  //   const NewTool: typeof UITool | undefined = Tools[name];
  //   // @ts-ignore - UITool is abstract, but none of these are UITools, ignore warning.
  //   this.#tool = NewTool === undefined ? undefined : new NewTool();
  // }

  constructor() {
    this.viewportManager = new ViewportManager(this);
    this.toolManager = new ToolManager(this);
    // this.panels = new PanelsManager(this);
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
    // this.panels.dealloc();
    this.unbind.forEach((fn) => fn());
  }
};

