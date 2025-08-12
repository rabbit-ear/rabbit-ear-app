import { LocalStorageItem } from "../app/LocalStorageItem.svelte";

export class Settings {
  // <boolean> if the X axis is to the right, is the Y axis up (right handed) or down (left).
  // <boolean> is the Y axis on top (true) or on bottom (false)?
  rightHanded = new LocalStorageItem<boolean>("ui/viewport", "rightHanded", true);

  // newEdgeAssignment = new LocalStorageItem<string>("ui", "newEdgeAssignment", "F");

  // <string> the unit grid that contributes to snap points ("square" or "triangle")
  tiling = new LocalStorageItem<string>("ui/viewport", "tiling", "square");
  showGrid = new LocalStorageItem<boolean>("ui/viewport", "showGrid", true);
  showAxes = new LocalStorageItem<boolean>("ui/viewport", "showAxes", true);

  // <number> a UI touch event, coming from a pointer device, will have some
  // built-in error correcting (like snapping, for example), and this behavior
  // is zoom-level dependent. This is the factor out of 1 which is
  // scaled to the viewbox to get this ui-epsilon floating point error factor.
  uiEpsilonFactor = new LocalStorageItem<number>("ui/viewport", "uiEpsilonFactor", 0.05);

  // <number> Snapping is zoom-level dependent, this is the factor
  // (out of 1) which is scaled to the viewbox to get the snap radius.
  snapRadiusFactor = new LocalStorageItem<number>("ui/viewport", "snapRadiusFactor", 0.05);
  radialSnapDegrees = new LocalStorageItem<number>("ui/viewport", "radialSnapDegrees", 22.5);
  radialSnapOffset = new LocalStorageItem<number>("ui/viewport", "radialSnapOffset", 0);
  strokeWidthFactor = new LocalStorageItem<number>("ui/viewport", "strokeWidthFactor", 0.001);
  strokeWidthAbsoluteMin = new LocalStorageItem<number>("ui/viewport", "strokeWidthAbsoluteMin", 0.001);
  vertexRadiusFactor = new LocalStorageItem<number>("ui/viewport", "vertexRadiusFactor", 0.005);

  layersNudge = new LocalStorageItem<number>("ui/layers", "nudge", 0.01);
  layersAutoSolve = new LocalStorageItem<boolean>("ui/layers", "autoSolve", true);

  scrollSensitivity = new LocalStorageItem<number>("ui", "scrollSensitivity", 1 / 300);
}

