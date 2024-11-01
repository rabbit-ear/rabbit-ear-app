//import Keyboard from "../../../app/Keyboard.svelte.ts";
//import {
//  storageKeys,
//  getStorageBoolean,
//  getStorageNumber,
//  getStorageString,
//} from "../../../app/localStorage.svelte.ts";
//import AppSettings from "../../../app/Settings.svelte.ts";

// these are global view settings that apply to all instances of SimulatorViewport
// accessible via the app: app.ui.types.SimulatorViewport.settings
class Settings {
  // override the material to show the model's strain forces
  strain = $state(false);

  // ask origami simulator to export the current 3D state
  exportModel = $state(() => { });

  unbind: (() => void)[] = [];
  constructor() {
    //this.unbind = [this.#bindToLocalStorage()];
  }

  dealloc(): void {
    this.unbind.forEach((fn) => fn());
  }
}

export default new Settings();
