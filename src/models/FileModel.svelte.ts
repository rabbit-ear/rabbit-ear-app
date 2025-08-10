import type { FOLD, FOLDChildFrame, FOLDFileMetadata } from "rabbit-ear/types.js";
import type { Model } from "./Model.ts";
import type { FrameAttributes } from "./FrameAttributes.ts";
// import { SimulatorModel } from "../model/Simulator/SimulatorModel.svelte.ts";
import { getFileMetadata } from "rabbit-ear/fold/spec.js";
import { getFileFramesAsArray } from "rabbit-ear/fold/frames.js";
import { reassembleFramesToFOLD, makeFlatFramesFromFrames } from "../general/fold.ts";
import { CreasePatternModel } from "./CreasePattern/CreasePatternModel.ts";
import { FoldedFormModel } from "./FoldedForm/FoldedFormModel.ts";
import { makeFrameAttributes } from "./FrameAttributes.ts";
import { FrameView } from "./FrameView.svelte.ts";
import { untrack } from "svelte";

export class FileModel {
  #metadata: FOLDFileMetadata = $state({});
  #framesRaw: FOLDChildFrame[] = $state.raw([]);

  // which frame index is currently selected by the app for rendering/modification
  activeFrameIndex: number = $state(0);

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

  #framesView: Map<FOLD, FrameView> = new Map();
  frameView: FrameView | undefined = $derived(this.#framesView.get(this.frame));

  // if models are removed, they need to call their dealloc() method
  // models: { [key: string]: Model } = $state({});
  cp: CreasePatternModel;
  folded: FoldedFormModel;
  // simulator: SimulatorModel;

  get creasePattern(): Model { return this.cp; }
  get foldedForm(): Model { return this.folded; }
  // get simulator(): Model { return this.simulator; }

  #effects: (() => void)[] = [];

  constructor(fold: FOLD) {
    this.#metadata = getFileMetadata(fold);
    this.#framesRaw = getFileFramesAsArray(fold);

    this.cp = new CreasePatternModel(this);
    this.folded = new FoldedFormModel(this);
    // this.simulator = new SimulatorModel(this);

    this.#effects = [this.#makeFrameViewEffect()];
    // console.log("+ New FileModel +");
    // console.log("metadata", $state.snapshot(this.#metadata));
    // console.log("frames", $state.snapshot(this.#framesRaw));
    // console.log("scene", this.sceneState);
  }

  #makeFrameViewEffect(): (() => void) {
    return $effect.root(() => {
      $effect(() => {
        // a frame in .frames which is not (yet) in .framesView
        // (a new frame has just been added)
        const newFrames = this.frames
          .filter(frame => !this.#framesView.has(frame));
        // a frame key in .framesView that is not in .frames
        // (a frame was removed)
        const removedFrames: FOLD[] = [];
        // for (const frame in this.#framesView.keys()) {
        for (const [key] of this.#framesView.entries()) {
          if (this.frames.indexOf(key) === -1) {
            removedFrames.push(key);
          }
        }
        untrack(() => {
          // newFrames.forEach(frame => this.#framesView.set(frame, new FrameView(frame)));
          newFrames.forEach(frame => this.#framesView.set(frame, new FrameView()));
          removedFrames.forEach(frame => this.#framesView.delete(frame));
        });
      });
      return () => {
        this.#framesView.clear();
      };
    })
  }

  export(): FOLD {
    return Object.assign(
      // reassembleFramesToFOLD($state.snapshot(this.#frames)),
      reassembleFramesToFOLD(this.#framesRaw),
      this.#metadata,
      // { shapes: this.shapes },
    );
  }

  exportToText(): string {
    return JSON.stringify(this.export());
  }

  import(fold: FOLD): void {
    this.#metadata = getFileMetadata(fold);
    this.#framesRaw = getFileFramesAsArray(fold);
    // todo: extended FOLD format
    //this.shapes = fold.shapes || [];
  }

  dealloc(): void {
    this.#effects.forEach(fn => fn());
    // this.simulator.dealloc();
    // scene state too?
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

