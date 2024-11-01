//import Keyboard from "../../../app/Keyboard.svelte.ts";
//import {
//  storageKeys,
//  getStorageBoolean,
//  getStorageNumber,
//  getStorageString,
//} from "../../../app/localStorage.svelte.ts";
//import AppSettings from "../../../app/Settings.svelte.ts";

// these are global view settings that apply to all instances of SVGViewport
// accessible via the app: app.ui.types.SVGViewport.settings
class Settings {
  foldAmount: number = $state(0.0);

  //#bindToLocalStorage(): () => void {
  //  return $effect.root(() => {
  //    $effect(() => {
  //      localStorage.setItem(storageKeys.scriptFontSize, String(this.fontSize));
  //    });
  //    return () => { };
  //  });
  //}

  unbind: (() => void)[] = [];

  constructor() {
    //this.unbind = [this.#bindToLocalStorage()];
  }

  dealloc(): void {
    this.unbind.forEach((fn) => fn());
  }
}

export default new Settings();
