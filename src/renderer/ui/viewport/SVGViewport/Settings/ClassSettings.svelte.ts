import Keyboard from "../../../../app/Keyboard.svelte.ts";
import {
  storageKeys,
  getStorageBoolean,
  getStorageNumber,
  getStorageString,
} from "../../../../app/localStorage.svelte.ts";
import AppSettings from "../../../../app/Settings.svelte.ts";

// these are global view settings that apply to all instances of SVGViewport
// accessible via the app: app.ui.types.SVGViewport.settings
class ClassSettings {
  // is the Y axis on top (true) or on bottom (false)?
  rightHanded: boolean = $derived(AppSettings.rightHanded);

  // the unit grid that contributes to snap points ("square" or "triangle")
  tiling: string = $state(getStorageString(storageKeys.svgTiling, "square"));
  showGrid: boolean = $state(getStorageBoolean(storageKeys.svgShowGrid, true));
  showAxes: boolean = $state(getStorageBoolean(storageKeys.svgShowAxes, true));

  // a UI touch event, coming from a pointer device, will have some
  // built-in error correcting (like snapping, for example), and this behavior
  // is zoom-level dependent. This is the factor out of 1 which is
  // scaled to the viewbox to get this ui-epsilon floating point error factor.
  uiEpsilonFactor: number = $state(
    getStorageNumber(storageKeys.svgUIEpsilonFactor, 0.05),
  );

  // Snapping is zoom-level dependent, this is the factor
  // (out of 1) which is scaled to the viewbox to get the snap radius.
  snapRadiusFactor: number = $state(
    getStorageNumber(storageKeys.svgSnapRadiusFactor, 0.05),
  );

  radialSnap: boolean = $derived(Keyboard.shift);
  radialSnapDegrees: number = $state(
    getStorageNumber(storageKeys.svgRadialSnapDegrees, 22.5),
  );
  radialSnapOffset: number = $state(getStorageNumber(storageKeys.svgRadialSnapOffset, 0));

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
        localStorage.setItem(storageKeys.svgTiling, String(this.tiling));
        localStorage.setItem(storageKeys.svgShowGrid, String(this.showGrid));
        localStorage.setItem(storageKeys.svgShowAxes, String(this.showAxes));

        localStorage.setItem(
          storageKeys.svgUIEpsilonFactor,
          String(this.uiEpsilonFactor),
        );
        localStorage.setItem(
          storageKeys.svgSnapRadiusFactor,
          String(this.snapRadiusFactor),
        );
        // radialSnap
        localStorage.setItem(
          storageKeys.svgRadialSnapDegrees,
          String(this.radialSnapDegrees),
        );
        localStorage.setItem(
          storageKeys.svgRadialSnapOffset,
          String(this.radialSnapOffset),
        );

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
      return () => {
        // empty
      };
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

export default new ClassSettings();

//class Settings {
//  // is the Y axis on top (true) or on bottom (false)?
//  rightHanded: boolean = localState<boolean>(storageKeys.svgRightHanded, true).value;
//
//  // the unit grid that contributes to snap points ("square" or "triangle")
//  tiling: string = localState<string>(storageKeys.svgTiling, "square").value;
//
//  showGrid: boolean = localState<boolean>(storageKeys.svgShowGrid, true).value;
//  showAxes: boolean = localState<boolean>(storageKeys.svgShowAxes, true).value;
//
//  radialSnap: boolean = $derived(keyboard.shift);
//  radialSnapDegrees: number = localState<number>(storageKeys.svgRadialSnapDegrees, 22.5).value;
//  radialSnapOffset: number = localState<number>(storageKeys.svgRadialSnapOffset, 0).value;
//
//  strokeWidthFactor: number = localState(storageKeys.svgStrokeWidthFactor, 0.001).value;
//  strokeWidthAbsoluteMin: number = localState(storageKeys.svgStrokeWidthAbsoluteMin, 0.001).value;
//  vertexRadiusFactor: number = localState(storageKeys.svgVertexRadiusFactor, 0.00666).value;
//
//  constructor() { }
//}
//
