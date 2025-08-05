import { LocalStorageItem } from "../app/LocalStorageItem.svelte";

export class Settings {
  // <boolean> if the X axis is to the right, is the Y axis up (right handed) or down (left).
  // <boolean> is the Y axis on top (true) or on bottom (false)?
  rightHanded = new LocalStorageItem<boolean>("ui", "rightHanded", true);

  // newEdgeAssignment = new LocalStorageItem<string>("ui", "newEdgeAssignment", "F");

  layersAutoSolve = new LocalStorageItem<boolean>("ui", "layersAutoSolve", true);
}
