import { LocalStorageItem } from "./LocalStorageItem.svelte";

export class Settings {
  newEdgeAssignment = new LocalStorageItem<string>("app", "newEdgeAssignment", "F");
}
