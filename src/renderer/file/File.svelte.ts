import type { FilePathInfo } from "../../main/fs/path.ts";
import { EXTENSION, UNTITLED_FILENAME } from "../app/constants.svelte.ts";
import { Geometry } from "./Geometry.svelte.ts";

// basically all information related to the file-system properties
// of the currently opened file.
// and more
export class File {
  // The currently opened filename as a full path, including the directory prefix.
  path: FilePathInfo | undefined = $state();
  // Has the current file been edited and not yet saved?
  modified: boolean = $state(false);
  geometry: Geometry;

  constructor() {
    this.geometry = new Geometry();
  }

  load(data: string, info: FilePathInfo): void {
    this.geometry.setFromString(data);
    this.path = info;
    this.modified = false;
  }

  loadEmpty(): void {
    this.geometry.clear();
    this.path = {
      fullpath: "",
      directory: "",
      file: UNTITLED_FILENAME,
      root: "untitled",
      extension: `.${EXTENSION}`,
    };
    this.modified = false;
  }

  update(data: string): void {
    this.geometry.setFromString(data);
  }

  getCopy(): string {
    return `shape count: ${this.geometry.shapes.length}`;
  }

  dealloc(): void {
    this.geometry.dealloc();
  }
}
