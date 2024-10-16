import { storageKeys, getStorageBoolean } from "./localStorage.svelte.ts";

// these are global view settings that apply to the entire app
// accessible via the app: app.settings
class Settings {
  // if the X axis is to the right, is the Y axis up (right handed) or down (left).
  // is the Y axis on top (true) or on bottom (false)?
  rightHanded: boolean = $state(getStorageBoolean(storageKeys.rightHanded, true));

  #bindToLocalStorage(): () => void {
    return $effect.root(() => {
      $effect(() => {
        localStorage.setItem(storageKeys.rightHanded, String(this.rightHanded));
      });
      return () => {};
    });
  }

  unbind: (() => void)[] = [];

  constructor() {
    this.unbind = [this.#bindToLocalStorage()];
  }

  dealloc(): void {
    this.unbind.forEach((fn) => fn());
  }
}

export default new Settings();
