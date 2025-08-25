import type { FOLD, FOLDChildFrame, FOLDFileMetadata } from "rabbit-ear/types.js";
import type { Embedding } from "./Embedding.ts";
import type { FrameAttributes } from "./FrameAttributes.ts";
import type { GraphUpdateEvent, GraphUpdateModifier } from "./Updated.ts";
import { makeGraphUpdateEvent, modifyGraphUpdate } from "./Updated.ts";
import { getFileMetadata } from "rabbit-ear/fold/spec.js";
import { getFileFramesAsArray } from "rabbit-ear/fold/frames.js";
import { reassembleFramesToFOLD, makeFlatFramesFromFrames } from "../general/fold.ts";
import { makeFrameAttributes } from "./FrameAttributes.ts";
import { CreasePattern } from "./CreasePattern/CreasePattern.svelte.ts";
import { FoldedForm } from "./FoldedForm/FoldedForm.svelte.ts";
import { Simulator } from "./Simulator/Simulator.svelte.ts";
import { ShapeManager } from "../shapes/ShapeManager.svelte.ts";

export class GraphData {
  metadata: FOLDFileMetadata = $state({});
  #source: FOLDChildFrame[] = $state.raw([]);

  // the signal to subscribe to instead of subscribing to frame or framesRaw, etc
  graphUpdate = $state<GraphUpdateEvent>(makeGraphUpdateEvent());

  // which frame index is currently selected by the app for rendering/modification
  frameIndex: number = $state(0);

  // get metadata(): FOLDFileMetadata { return this.#metadata; }
  // set metadata(data: FOLDFileMetadata) { this.#metadata = data; }

  // some frames inherit from a parent and need to be "collapsed" to be render-able.
  // this is a list of all of the frames, collapsed, and in their "final form",
  // frames: FOLD[] = $derived(makeFlatFramesFromFrames($state.snapshot(this.#source)));
  frames: FOLD[] = $derived(makeFlatFramesFromFrames(this.#source));

  // which frame is currently selected by the app for rendering/modification
  frame: FOLD = $derived.by(() => this.frames[this.frameIndex]);

  // which frame is currently selected by the app for rendering/modification
  // taken from the "raw" frames (not collapsed if inherits from a parent)
  frameRaw: FOLDChildFrame = $derived.by(() => this.#source[this.frameIndex]);

  // style-related properties for every frame, like is it 2D, folded, etc..
  framesAttributes: FrameAttributes[] = $derived.by(() => this.frames.map(makeFrameAttributes));
  frameAttributes: FrameAttributes = $derived.by(() => this.framesAttributes[this.frameIndex]);

  shapeManager: ShapeManager;

  // it might be possible to "unfold" the vertices
  cpFOLD: FOLD | undefined = $derived(this.frameAttributes?.isFoldedForm
    ? undefined
    : this.frame);

  // models: { [key: string]: Model } = $state({});
  cp: CreasePattern;
  folded: FoldedForm;
  simulator: Simulator;

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
      case "sim":
      case "simulator":
      case "Simulator":
        return this.simulator;
      default: return undefined;
    }
  }

  get creasePattern(): Embedding { return this.cp; }
  get foldedForm(): Embedding { return this.folded; }
  get sim(): Embedding { return this.simulator; }

  constructor(fold: FOLD) {
    this.metadata = getFileMetadata(fold);
    this.#source = getFileFramesAsArray(fold);
    this.shapeManager = new ShapeManager();

    this.cp = new CreasePattern(this);
    this.folded = new FoldedForm(this);
    this.simulator = new Simulator(this);
  }

  dealloc(): void {
    this.cp.dealloc();
    this.folded.dealloc();
    this.simulator.dealloc();
  }

  export(): FOLD {
    return Object.assign(
      // reassembleFramesToFOLD($state.snapshot(this.#frames)),
      reassembleFramesToFOLD(this.#source),
      this.metadata,
      // { shapes: this.shapes },
    );
  }

  exportToText(): string {
    return JSON.stringify(this.export());
  }

  import(fold: FOLD): void {
    this.metadata = getFileMetadata(fold);
    this.#source = getFileFramesAsArray(fold);
    // todo: extended FOLD format
    //this.shapes = fold.shapes || [];
  }

  get source() { return this.#source; }
  set source(newFrames: FOLDChildFrame[]) { this.#source = newFrames; }

  // public facing method. all changes should go through here
  mutate(mutator: (frame: FOLDChildFrame, data?: GraphData) => (GraphUpdateModifier | undefined)) {
    const frame = this.#source[this.frameIndex];
    const updateModifier = mutator(frame, this);
    if (updateModifier) {
      this.#source = [
        ...this.#source.slice(0, this.frameIndex),
        frame,
        ...this.#source.slice(this.frameIndex + 1),
      ];
    }

    // if mutator returns undefined, this implies that no changes were made,
    // we should not propagate any reactive "did change" signals.
    if (updateModifier) {
      modifyGraphUpdate(this.graphUpdate, updateModifier);
    }
  }
}

