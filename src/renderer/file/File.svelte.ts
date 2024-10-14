import type { FOLD, FOLDFileMetadata } from "rabbit-ear/types.js";
import { getFileMetadata } from "rabbit-ear/fold/spec.js";
import type { FilePathInfo } from "../../main/fs/path.ts";
import { Geometry } from "./Geometry.svelte.ts";

// basically all information related to the file-system properties
// of the currently opened file.
// and more
export class File {
  path: FilePathInfo = $state();
  graph: FOLD = $state();
  metadata: FOLDFileMetadata;
  geometry: Geometry;
  // Has the current file been edited and not yet saved?
  modified: boolean = $state(false);

  constructor(path: FilePathInfo, data: FOLD) {
    this.path = path;
    this.graph = data;
    this.metadata = getFileMetadata(data);
    this.geometry = new Geometry();
  }

  load(data: string, path: FilePathInfo): void {
    this.geometry.setFromString(data);
    this.path = path;
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
