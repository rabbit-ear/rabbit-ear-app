import type { FOLD, FOLDChildFrame, FOLDFileMetadata } from "rabbit-ear/types.js";
import type { Model } from "../model/Model.ts";
import type { FrameStyle } from "../model/FrameStyle.ts";
import { CreasePatternModel } from "../model/CreasePattern/CreasePatternModel.svelte.ts";
import { FoldedFormModel } from "../model/FoldedForm/FoldedFormModel.svelte.ts";
// import { SimulatorModel } from "../model/Simulator/SimulatorModel.svelte.ts";
import { getFileMetadata } from "rabbit-ear/fold/spec.js";
import { getFileFramesAsArray } from "rabbit-ear/fold/frames.js";
import { reassembleFramesToFOLD, makeFlatFramesFromFrames } from "../general/fold.ts";
import { makeFrameStyle } from "../model/FrameStyle.ts";
import type { SimulatorModel } from "../model/Simulator/SimulatorModel.svelte.ts";

export class FileModel {
  #metadata: FOLDFileMetadata = $state({});
  #frames: FOLDChildFrame[] = $state.raw([]);

  framesFlat: FOLD[] = $derived(makeFlatFramesFromFrames(this.#frames));
  framesStyle: FrameStyle[] = $derived.by(() => this.framesFlat.map(makeFrameStyle));

  activeFrameIndex: number = $state(0);

  frame: FOLDChildFrame = $derived.by(() => this.#frames[this.activeFrameIndex]);
  frameFlat: FOLD = $derived.by(() => this.framesFlat[this.activeFrameIndex]);
  frameStyle: FrameStyle = $derived.by(() => this.framesStyle[this.activeFrameIndex]);

  // if models are removed, they need to call their dealloc() method
  // models: { [key: string]: Model } = $state({});
  cp: CreasePatternModel;
  folded: FoldedFormModel;
  // simulator: SimulatorModel;

  // constructor(json: string) {
  constructor(data: FOLD) {
    this.#metadata = getFileMetadata(data);
    this.#frames = getFileFramesAsArray(data);

    this.cp = new CreasePatternModel(this);
    this.folded = new FoldedFormModel(this);
    // this.simulator = new SimulatorModel(this);

    // this.models = {
    //   [cp.name]: cp,
    //   [folded.name]: folded,
    //   // [simulator.name]: simulator,
    // };

    console.log("metadata", $state.snapshot(this.#metadata));
    console.log("frames", $state.snapshot(this.#frames));
  }

  export(): FOLD {
    return Object.assign(
      // reassembleFramesToFOLD($state.snapshot(this.#frames)),
      reassembleFramesToFOLD(this.#frames),
      this.#metadata,
      // { shapes: this.shapes },
    );
  }

  exportToText(): string {
    return JSON.stringify(this.export());
  }

  import(fold: FOLD): void {
    this.#metadata = getFileMetadata(fold);
    this.#frames = getFileFramesAsArray(fold);
    // todo: extended FOLD format
    //this.shapes = fold.shapes || [];
  }

  dealloc(): void {
    // todo: these used to exist. i wonder
    // if we're missing some important dealloc
    // this.cp.dealloc();
    // this.folded.dealloc();
    // this.simulator.dealloc();
  }

  get creasePattern(): Model {
    return this.cp;
  }

  get foldedForm(): Model {
    return this.folded;
  }

  // get simulator(): Model {
  //   return this.simulator;
  // }
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

