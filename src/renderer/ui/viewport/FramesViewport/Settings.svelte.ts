import {
  storageKeys,
  getStorageBoolean,
  getStorageNumber,
  //getStorageString,
} from "../../../app/localStorage.svelte.ts";

// these are global view settings that apply to all instances of SVGViewport
// accessible via the app: app.ui.types.SVGViewport.settings
class Settings {
  // is the Y axis on top (true) or on bottom (false)?
  rightHanded: boolean = $derived(getStorageBoolean(storageKeys.rightHanded, true));

  strokeWidthFactor: number = $state(
    getStorageNumber(storageKeys.svgStrokeWidthFactor, 0.001),
  );
  strokeWidthAbsoluteMin: number = $state(
    getStorageNumber(storageKeys.svgStrokeWidthAbsoluteMin, 0.001),
  );
  vertexRadiusFactor: number = $state(
    getStorageNumber(storageKeys.svgVertexRadiusFactor, 0.00666),
  );

  #bindToLocalStorage(): () => void {
    return $effect.root(() => {
      $effect(() => {
        localStorage.setItem(
          storageKeys.svgStrokeWidthFactor,
          String(this.strokeWidthFactor),
        );
        localStorage.setItem(
          storageKeys.svgStrokeWidthAbsoluteMin,
          String(this.strokeWidthAbsoluteMin),
        );
        localStorage.setItem(
          storageKeys.svgVertexRadiusFactor,
          String(this.vertexRadiusFactor),
        );
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
