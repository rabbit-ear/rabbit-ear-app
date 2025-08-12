import context from "../../../app/context.svelte.ts";
// import { LocalStorageItem } from "../../../app/LocalStorageItem.svelte.ts";

// these are global view settings that apply to all instances of SVGViewport
// accessible via the app: app.ui.types.SVGViewport.settings
export class Settings {
  cursor: [number, number] = $state([0, 0]);

  rightHanded: boolean = $derived(context.ui.settings.rightHanded.value);
  tiling: string = $derived(context.ui.settings.tiling.value);
  showGrid: boolean = $derived(context.ui.settings.showGrid.value);
  showAxes: boolean = $derived(context.ui.settings.showAxes.value);
  uiEpsilonFactor: number = $derived(context.ui.settings.uiEpsilonFactor.value);
  snapRadiusFactor: number = $derived(context.ui.settings.snapRadiusFactor.value);
  radialSnapDegrees: number = $derived(context.ui.settings.radialSnapDegrees.value);
  radialSnapOffset: number = $derived(context.ui.settings.radialSnapOffset.value);
  strokeWidthFactor: number = $derived(context.ui.settings.strokeWidthFactor.value);
  strokeWidthAbsoluteMin: number = $derived(context.ui.settings.strokeWidthAbsoluteMin.value);
  vertexRadiusFactor: number = $derived(context.ui.settings.vertexRadiusFactor.value);

  // consider putting this on the tools themselves.
  // strange to have it watching always, even when not necessary
  radialSnap: boolean = $derived(context.keyboardManager.shift);

  scrollSensitivity: number = $derived(context.ui.settings.scrollSensitivity.value);
};

