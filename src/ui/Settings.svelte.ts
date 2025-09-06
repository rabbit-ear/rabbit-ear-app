import { LocalStorageItem } from "../app/LocalStorageItem.svelte";

export enum UIMode {
  mesh,
  ruler,
}

export class Settings {
  mode: UIMode = $state(UIMode.mesh);

  // boundary handling during operations on a selection
  selectionHandling = new LocalStorageItem<string>("ui/selection", "selectionHandling", "detach");
  selectionFilter = {
    vertices: new LocalStorageItem<boolean>("ui/selection", "selectionFilterVertices", true),
    edges: new LocalStorageItem<boolean>("ui/selection", "selectionFilterEdges", true),
    faces: new LocalStorageItem<boolean>("ui/selection", "selectionFilterFaces", true),
  };
  get selectionFilterObject() {
    return {
      vertices: this.selectionFilter.vertices.value,
      edges: this.selectionFilter.edges.value,
      faces: this.selectionFilter.faces.value,
    };
  }

  // <boolean> if the X axis is to the right, is the Y axis up (right handed) or down (left).
  // <boolean> is the Y axis on top (true) or on bottom (false)?
  rightHanded = new LocalStorageItem<boolean>("ui/viewport", "rightHanded", true);

  // newEdgeAssignment = new LocalStorageItem<string>("ui", "newEdgeAssignment", "F");

  // <string> the unit grid that contributes to snap points ("square" or "triangle")
  tiling = new LocalStorageItem<string>("ui/viewport", "tiling", "square");
  showGrid = new LocalStorageItem<boolean>("ui/viewport", "showGrid", true);
  showAxes = new LocalStorageItem<boolean>("ui/viewport", "showAxes", true);

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

  scrollSensitivity = new LocalStorageItem<number>("ui/input", "scrollSensitivity", 1 / 300);

  darkMode = new LocalStorageItem<boolean>("ui/style", "darkMode", true);
  modelColorFront = new LocalStorageItem<string>("ui/style", "modelColorFront", "#17F");
  modelColorBack = new LocalStorageItem<string>("ui/style", "modelColorBack", "white");
  modelColorOutline = new LocalStorageItem<string>("ui/style", "modelColorOutline", "black");
  // #9e9b9b
  modelColorTranslucent = new LocalStorageItem<string>("ui/style", "modelColorTranslucent", "#999");
  modelOpacityOpaque = new LocalStorageItem<number>("ui/style", "modelOpacityOpaque", 1.0);
  modelOpacityTranslucent = new LocalStorageItem<number>("ui/style", "modelOpacityTranslucent", 0.25);
}

