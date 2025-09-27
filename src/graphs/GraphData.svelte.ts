import type { FOLD, FOLDChildFrame, FOLDFileMetadata } from "rabbit-ear/types.js";
import type { Embedding } from "./Embedding.ts";
import type { GraphUpdateEvent, GraphUpdateModifier } from "./Updated.ts";
import { makeGraphUpdateEvent, modifyGraphUpdate } from "./Updated.ts";
import { getFileMetadata } from "rabbit-ear/fold/spec.js";
import { countFrames, flattenFrame } from "rabbit-ear/fold/frames.js";
import {
  reassembleFramesToFOLD,
  prepareFOLDFrames,
} from "../general/fold.ts";
import { CreasePattern } from "./CreasePattern/CreasePattern.svelte.ts";
import { FoldedForm } from "./FoldedForm/FoldedForm.svelte.ts";
import { Simulator } from "./Simulator/Simulator.svelte.ts";
import { Frame } from "./Frame.ts";

export class GraphData {
  metadata: FOLDFileMetadata = $state({});

  // frames: Frame[] = $state([]);
  frames: Frame[] = [];

  // frame: Frame = $derived.by(() => this.frames[this.frameIndex]);
  // frame: Frame = $state(this.frames[this.#frameIndex]);
  frame: Frame;

  // the signal to subscribe to instead of subscribing to frame or framesRaw, etc
  // todo: are we still using this? We're definitely using the ones on the embeddings.
  graphUpdate = $state<GraphUpdateEvent>(makeGraphUpdateEvent());

  // which frame index is currently selected by the app for rendering/modification
  #frameIndex: number = $state(0);
  get frameIndex(): number { return this.#frameIndex; }
  set frameIndex(index: number) {
    // console.log("new frame (start)", this.frame);
    this.#frameIndex = index;
    this.frame = this.frames[this.#frameIndex];
    this.graphUpdate.reset++;
    // console.log("new frame (end)", this.frame);
  }

  // style-related properties for every frame, like is it 2D, folded, etc..
  // frameAttributes: FrameAttributes = $derived.by(() => this.frame.sourceAttributes);
  // get frameAttributes(): FrameAttributes { return this.frame.attributes; }

  // models: { [key: string]: Model } = $state({});
  creasePattern: CreasePattern;
  foldedForm: FoldedForm;
  simulator: Simulator;

  get cp(): Embedding { return this.creasePattern; }
  get folded(): Embedding { return this.foldedForm; }
  get sim(): Embedding { return this.simulator; }

  getEmbedding(name: string): Embedding | undefined {
    switch (name) {
      case "cp":
      case "creasePattern":
      case "CreasePattern":
        return this.creasePattern;
      case "folded":
      case "foldedForm":
      case "FoldedForm":
        return this.foldedForm;
      case "sim":
      case "simulator":
      case "Simulator":
        return this.simulator;
      default: return undefined;
    }
  }

  #effects: (() => void)[] = [];

  constructor(fold: FOLD) {
    // const frames = getFileFramesAsArray(fold);
    const frames = Array.from(Array(countFrames(fold)))
      .map((_, i) => flattenFrame(fold, i));

    // this.#source = prepareFOLDFrames(frames);
    prepareFOLDFrames(frames);

    this.frames = frames
      .map(frame => new Frame(frame));
    this.frame = this.frames[this.#frameIndex];
    this.metadata = getFileMetadata(fold);

    this.creasePattern = new CreasePattern(this);
    this.foldedForm = new FoldedForm(this);
    this.simulator = new Simulator(this);

    this.#effects = [
      this.#debug(),
    ];
  }

  dealloc(): void {
    this.creasePattern.dealloc();
    this.foldedForm.dealloc();
    this.simulator.dealloc();
    this.#effects.forEach(fn => fn());
  }

  export(): FOLD {
    return Object.assign(
      // reassembleFramesToFOLD($state.snapshot(this.#frames)),
      // reassembleFramesToFOLD(this.#source),
      reassembleFramesToFOLD(this.frames.map(frame => frame.graph)),
      this.metadata,
      // { shapes: this.shapes },
    );
  }

  exportToText(): string {
    return JSON.stringify(this.export());
  }

  // import(fold: FOLD): void {
  //   this.metadata = getFileMetadata(fold);
  //   this.#source = getFileFramesAsArray(fold);
  //   // todo: extended FOLD format
  //   //this.shapes = fold.shapes || [];
  // }

  // get source() { return this.#source; }
  // set source(newFrames: FOLDChildFrame[]) { this.#source = newFrames; }

  // when a user runs a modification function, this will get called near the end
  // any additional updates will be handled
  #didUpdate(updateModifier: GraphUpdateModifier) {
    if (updateModifier.reset || updateModifier.structural) {
      this.frame.selection = undefined;
    }
  }

  // public facing method. all changes should go through here
  // if mutator returns undefined, this implies that no changes were made,
  // we should not propagate any reactive "did change" signals.
  mutateGraph(mutator: (frame: FOLDChildFrame) => (GraphUpdateModifier | undefined)) {
    const updateModifier = mutator(this.frame.graph);
    if (updateModifier) {
      // this.frames[this.frameIndex].graph = graph;
      this.#didUpdate(updateModifier);
      modifyGraphUpdate(this.graphUpdate, updateModifier);
    }
  }

  mutateFrame(mutator: (frame: Frame) => (GraphUpdateModifier | undefined)) {
    const updateModifier = mutator(this.frame);
    if (updateModifier) {
      // this.frames[this.frameIndex] = frame;
      this.#didUpdate(updateModifier);
      modifyGraphUpdate(this.graphUpdate, updateModifier);
    }
  }

  mutateData(mutator: (data: GraphData) => (GraphUpdateModifier | undefined)) {
    const updateModifier = mutator(this);
    if (updateModifier) {
      this.#didUpdate(updateModifier);
      modifyGraphUpdate(this.graphUpdate, updateModifier);
    }
  }

  #debug() {
    return $effect.root(() => {
      $effect(() => { });
      return () => { };
    });
  }
}

