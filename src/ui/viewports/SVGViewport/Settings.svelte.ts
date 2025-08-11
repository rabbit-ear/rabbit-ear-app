// import Keyboard from "../../../../app/Keyboard.svelte.ts";
import context from "../../../app/context.svelte.ts";
// import { LocalStorageItem } from "../../../app/LocalStorageItem.svelte.ts";

// these are global view settings that apply to all instances of SVGViewport
// accessible via the app: app.ui.types.SVGViewport.settings
export class Settings {
  cursor: [number, number] = $state([0, 0]);

  // <string> the unit grid that contributes to snap points ("square" or "triangle")
  // tiling = new LocalStorageItem<string>("ui/svg", "tiling", "square");
  // showGrid = new LocalStorageItem<boolean>("ui/svg", "showGrid", true);
  // showAxes = new LocalStorageItem<boolean>("ui/svg", "showAxes", true);
  tiling = $derived(context.ui?.settings.tiling.value ?? "square");
  showGrid = $derived(context.ui?.settings.showGrid.value ?? true);
  showAxes = $derived(context.ui?.settings.showAxes.value ?? true);

  // <number> a UI touch event, coming from a pointer device, will have some
  // built-in error correcting (like snapping, for example), and this behavior
  // is zoom-level dependent. This is the factor out of 1 which is
  // scaled to the viewbox to get this ui-epsilon floating point error factor.
  // uiEpsilonFactor = new LocalStorageItem<number>("ui/svg", "uiEpsilonFactor", 0.05);
  uiEpsilonFactor = $derived(context.ui?.settings.uiEpsilonFactor.value ?? 0.05);

  // <number> Snapping is zoom-level dependent, this is the factor
  // (out of 1) which is scaled to the viewbox to get the snap radius.
  // snapRadiusFactor = new LocalStorageItem<number>("ui/svg", "snapRadiusFactor", 0.05);
  // radialSnapDegrees = new LocalStorageItem<number>("ui/svg", "radialSnapDegrees", 22.5);
  // radialSnapOffset = new LocalStorageItem<number>("ui/svg", "radialSnapOffset", 0);
  // strokeWidthFactor = new LocalStorageItem<number>("ui/svg", "strokeWidthFactor", 0.001);
  // strokeWidthAbsoluteMin = new LocalStorageItem<number>("ui/svg", "strokeWidthAbsoluteMin", 0.001);
  // vertexRadiusFactor = new LocalStorageItem<number>("ui/svg", "vertexRadiusFactor", 0.00666);
  snapRadiusFactor = $derived(context.ui?.settings.snapRadiusFactor.value ?? 0.05);
  radialSnapDegrees = $derived(context.ui?.settings.radialSnapDegrees.value ?? 22.5);
  radialSnapOffset = $derived(context.ui?.settings.radialSnapOffset.value ?? 0);
  strokeWidthFactor = $derived(context.ui?.settings.strokeWidthFactor.value ?? 0.001);
  strokeWidthAbsoluteMin = $derived(context.ui?.settings.strokeWidthAbsoluteMin.value ?? 0.001);
  vertexRadiusFactor = $derived(context.ui?.settings.vertexRadiusFactor.value ?? 0.00666);
  // radialSnap: boolean = $derived(Keyboard.shift);

  rightHanded: boolean = $derived(context.ui?.settings.rightHanded.value ?? true);
};

