//import {
//  storageKeys,
//  getStorageBoolean,
//  getStorageNumber,
//  getStorageString,
//} from "../../../app/localStorage.svelte.ts";

class Settings {
  //example: string = $state(getStorageString(storageKeys.terminalExampleKey, "default"));

  unbind: (() => void)[] = [];

  constructor() {
    this.unbind = [];
  }

  dealloc(): void {
    this.unbind.forEach((fn) => fn());
  }
}

export default new Settings();
