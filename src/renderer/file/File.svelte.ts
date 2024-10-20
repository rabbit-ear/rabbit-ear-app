import type { FOLD, FOLDFileMetadata } from "rabbit-ear/types.js";
import { getFileMetadata } from "rabbit-ear/fold/spec.js";
import { flattenFrame, getFileFramesAsArray } from "rabbit-ear/fold/frames.js";
import type { FilePathInfo } from "../../main/fs/path.ts";
import { Geometry } from "./Geometry.svelte.ts";

/**
 * @description a FOLD object with frames is arranged such that
 * the top level is frame [0], and frames 1...N-1 are inside of
 * an array under the key "file_frames". This method converts
 * a flat array of frames into a FOLD object with "file_frames".
 */
export const reassembleFramesToFOLD = (frames): FOLD => {
  const fold = { ...frames[0] };
  const file_frames = frames.slice(1);
  if (file_frames.length) {
    fold.file_frames = file_frames;
  }
  return fold;
};

// basically all information related to the file-system properties
// of the currently opened file.
// and more
export class File {
  path: FilePathInfo = $state();
  metadata: FOLDFileMetadata = $state();
  frames: FOLD[] = $state.raw([]);
  activeFrame: number = $state(0);
  // Has the current file been edited and not yet saved?
  modified: boolean = $state(false);

  geometry: Geometry;

  framesFlat: FOLD[] = $derived.by(() => {
    try {
      const fold = reassembleFramesToFOLD($state.snapshot(this.frames));
      return this.frames.map((_, i) => flattenFrame(fold, i));
    } catch (error) {
      console.log(error);
      return [];
    }
  });

  graph: FOLD = $derived(this.framesFlat[this.activeFrame]);

  constructor(path: FilePathInfo, data: FOLD) {
    this.path = path;
    this.metadata = getFileMetadata(data);
    this.frames = getFileFramesAsArray(data);
    this.activeFrame = 0;

    this.geometry = new Geometry();
  }

  //load(data: string, path: FilePathInfo): void {
  //  this.geometry.setFromString(data);
  //  this.path = path;
  //  this.modified = false;
  //}

  // used by kernel commands undo()
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
