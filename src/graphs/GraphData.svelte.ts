import type { FOLD, FOLDChildFrame, FOLDFileMetadata } from "rabbit-ear/types.js";
import type { Embedding } from "./Embedding.ts";
import type { FrameAttributes } from "./FrameAttributes.ts";
// import { SimulatorModel } from "../model/Simulator/SimulatorModel.svelte.ts";
import { getFileMetadata } from "rabbit-ear/fold/spec.js";
import { getFileFramesAsArray } from "rabbit-ear/fold/frames.js";
import { reassembleFramesToFOLD, makeFlatFramesFromFrames } from "../general/fold.ts";
import { CreasePattern } from "./CreasePattern/CreasePattern.svelte.ts";
import { FoldedForm } from "./FoldedForm/FoldedForm.ts";
import { makeFrameAttributes } from "./FrameAttributes.ts";

export class GraphData {
  metadata: FOLDFileMetadata = $state({});
  #framesRaw: FOLDChildFrame[] = $state.raw([]);

  // which frame index is currently selected by the app for rendering/modification
  activeFrameIndex: number = $state(0);

  // get metadata(): FOLDFileMetadata { return this.#metadata; }
  // set metadata(data: FOLDFileMetadata) { this.#metadata = data; }

  // some frames inherit from a parent and need to be "collapsed" to be render-able.
  // this is a list of all of the frames, collapsed, and in their "final form",
  frames: FOLD[] = $derived(makeFlatFramesFromFrames(this.#framesRaw));

  // which frame is currently selected by the app for rendering/modification
  frame: FOLD = $derived.by(() => this.frames[this.activeFrameIndex]);

  // which frame is currently selected by the app for rendering/modification
  // taken from the "raw" frames (not collapsed if inherits from a parent)
  frameRaw: FOLDChildFrame = $derived.by(() => this.#framesRaw[this.activeFrameIndex]);

  // style-related properties for every frame, like is it 2D, folded, etc..
  framesAttributes: FrameAttributes[] = $derived.by(() => this.frames.map(makeFrameAttributes));
  frameAttributes: FrameAttributes = $derived.by(() => this.framesAttributes[this.activeFrameIndex]);

  // if models are removed, they need to call their dealloc() method
  // models: { [key: string]: Model } = $state({});
  cp: CreasePattern;
  folded: FoldedForm;
  // simulator: SimulatorModel;

  getEmbedding(name: string): Embedding | undefined {
    switch (name) {
      case "cp":
      case "creasePattern":
      case "CreasePattern":
        return this.cp;
      case "folded":
      case "foldedForm":
      case "FoldedForm":
        return this.folded;
      default: return undefined;
    }
  }

  get creasePattern(): Embedding { return this.cp; }
  get foldedForm(): Embedding { return this.folded; }
  // get simulator(): Model { return this.simulator; }

  constructor(fold: FOLD) {
    this.metadata = getFileMetadata(fold);
    this.#framesRaw = getFileFramesAsArray(fold);

    this.cp = new CreasePattern(this);
    this.folded = new FoldedForm(this);
    // this.simulator = new SimulatorModel(this);
  }

  dealloc(): void {
    // this.simulator.dealloc();
    // // these don't have dealloc methods but if they do, call them here
    // this.cp.dealloc();
    // this.folded.dealloc();
  }

  export(): FOLD {
    return Object.assign(
      // reassembleFramesToFOLD($state.snapshot(this.#frames)),
      reassembleFramesToFOLD(this.#framesRaw),
      this.metadata,
      // { shapes: this.shapes },
    );
  }

  exportToText(): string {
    return JSON.stringify(this.export());
  }

  import(fold: FOLD): void {
    this.metadata = getFileMetadata(fold);
    this.#framesRaw = getFileFramesAsArray(fold);
    // todo: extended FOLD format
    //this.shapes = fold.shapes || [];
  }
}

// export class FileModel {
//   private dataText: string;
//
//   constructor(contents?: string) {
//     this.dataText = contents || "";
//   }
//
//   get text(): string { return this.dataText; }
//   set text(newText: string) { this.dataText = newText; }
// }

