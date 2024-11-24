import type { FOLD, FOLDChildFrame, FOLDFileMetadata } from "rabbit-ear/types.js";
import type { FilePathInfo } from "../../main/fs/path.ts";
import type { CommandAndResult } from "../kernel/commands/Command.svelte.ts";
import type { Shape } from "../geometry/shapes.ts";
import type { FrameStyle } from "./FrameStyle.ts";
import { getFileMetadata } from "rabbit-ear/fold/spec.js";
import { getFileFramesAsArray } from "rabbit-ear/fold/frames.js";
import { reassembleFramesToFOLD, makeFlatFramesFromFrames } from "../general/fold.ts";
import { makeFrameStyle } from "./FrameStyle.ts";

// basically all information related to the file-system properties
// of the currently opened file.
// and more
export class File {
  path: FilePathInfo = $state();
  metadata: FOLDFileMetadata = $state();
  shapes: Shape[] = $state([]);
  // Has the current file been edited and not yet saved?
  modified: boolean = $state(false);

  frames: FOLDChildFrame[] = $state.raw([]);
  framesFlat: FOLD[] = $derived(makeFlatFramesFromFrames(this.frames));
  framesStyle: FrameStyle[] = $derived.by(() => this.framesFlat.map(makeFrameStyle));

  history = $state<CommandAndResult[]>([]);
  redoStack = $state<CommandAndResult[]>([]);

  constructor(path: FilePathInfo, data: FOLD) {
    this.path = path;
    this.metadata = getFileMetadata(data);
    this.frames = getFileFramesAsArray(data);
    this.shapes = [];
  }

  //load(data: string, path: FilePathInfo): void {
  //  this.geometry.setFromString(data);
  //  this.path = path;
  //  this.modified = false;
  //}

  // used by kernel commands undo()
  export(): FOLD {
    return Object.assign(
      reassembleFramesToFOLD($state.snapshot(this.frames)),
      this.metadata,
      { shapes: this.shapes },
    );
  }

  import(fold: FOLD): void {
    this.metadata = getFileMetadata(fold);
    this.frames = getFileFramesAsArray(fold);
    this.shapes = fold.shapes || [];
  }

  dealloc(): void {
    // empty
  }
}
