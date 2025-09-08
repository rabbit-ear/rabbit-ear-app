import type { FOLD, FOLDChildFrame, FOLDFileMetadata } from "rabbit-ear/types.js";
import type { Embedding } from "./Embedding.ts";
import type { GraphUpdateEvent, GraphUpdateModifier } from "./Updated.ts";
import type { FOLDSelection } from "../general/selection.ts";
import { makeGraphUpdateEvent, modifyGraphUpdate } from "./Updated.ts";
import { getFileMetadata } from "rabbit-ear/fold/spec.js";
import { getFileFramesAsArray } from "rabbit-ear/fold/frames.js";
import {
  reassembleFramesToFOLD,
  prepareFOLDNonSpecData,
} from "../general/fold.ts";
import { CreasePattern } from "./CreasePattern/CreasePattern.svelte.ts";
import { FoldedForm } from "./FoldedForm/FoldedForm.svelte.ts";
import { Simulator } from "./Simulator/Simulator.svelte.ts";
import { ShapeManager } from "../shapes/ShapeManager.svelte.ts";
import { Frame } from "./Frame.ts";
import { strictSubcomplex, strictSubgraph, vertexSubgraph } from "../general/subcomplex.ts";
import { getSelectionSeam } from "../general/seam.ts";

export class GraphData {
  metadata: FOLDFileMetadata = $state({});
  #source: FOLDChildFrame[] = $state.raw([]);

  // the signal to subscribe to instead of subscribing to frame or framesRaw, etc
  // todo: are we still using this? We're definitely using the ones on the embeddings.
  graphUpdate = $state<GraphUpdateEvent>(makeGraphUpdateEvent());

  // which frame index is currently selected by the app for rendering/modification
  frameIndex: number = $state(0);

  frame: Frame = $derived.by(() => new Frame(this.#source, this.frameIndex));

  // frames: Frame[] = $derived
  //   .by(() => this.#source.map((source, i) => new NewFrame(source, i)));

  // style-related properties for every frame, like is it 2D, folded, etc..
  // frameAttributes: FrameAttributes = $derived.by(() => this.frame.sourceAttributes);
  // get frameAttributes(): FrameAttributes { return this.frame.attributes; }

  selection?: FOLDSelection = $state();

  // adding this, unsure if it should be reactive or not
  // selectionGraph: FOLD | undefined;
  // selectionGraph: FOLD | undefined = $derived(getSubgraph(this.frame.baked, this.selection ?? {}));
  // selectionGraph: FOLD | undefined = $derived(simpleSubgraph(
  //   this.frame.baked,
  //   this.selection ?? {},
  // ));

  selectionFaceGraph: FOLD | undefined = $derived(strictSubcomplex(
    this.frame.baked,
    this.selection ?? {},
  ));

  selectionEdgeGraph: FOLD | undefined = $derived(strictSubgraph(
    this.frame.baked,
    this.selection ?? {},
  ));

  selectionVertexGraph: FOLD | undefined = $derived(vertexSubgraph(
    this.frame.baked,
    this.selection ?? {},
  ));

  shapeManager: ShapeManager;

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
    const frames = getFileFramesAsArray(fold);
    this.#source = prepareFOLDNonSpecData(frames);
    this.metadata = getFileMetadata(fold);
    this.shapeManager = new ShapeManager();

    this.creasePattern = new CreasePattern(this);
    this.foldedForm = new FoldedForm(this);
    this.simulator = new Simulator(this);

    this.#effects = [
      this.#effectFrameChange(),
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

  // when a user runs a modification function, this will get called near the end
  // any additional updates will be handled
  #didUpdate(updateModifier: GraphUpdateModifier) {
    if (updateModifier.reset || updateModifier.structural) {
      this.selection = undefined;
    }
  }

  // public facing method. all changes should go through here
  // if mutator returns undefined, this implies that no changes were made,
  // we should not propagate any reactive "did change" signals.
  mutateFrame(mutator: (frame: FOLDChildFrame) => (GraphUpdateModifier | undefined)) {
    const frame = this.#source[this.frameIndex];
    const updateModifier = mutator(frame);
    if (updateModifier) {
      this.#source = [
        ...this.#source.slice(0, this.frameIndex),
        frame,
        ...this.#source.slice(this.frameIndex + 1),
      ];
      // this.#source[this.frameIndex] = frame;
      this.#didUpdate(updateModifier);
      modifyGraphUpdate(this.graphUpdate, updateModifier);
    }
  }

  mutateSource(mutator: (data: GraphData) => (GraphUpdateModifier | undefined)) {
    const updateModifier = mutator(this);
    if (updateModifier) {
      this.#source = [...this.#source];
      this.#didUpdate(updateModifier);
      modifyGraphUpdate(this.graphUpdate, updateModifier);
    }
  }

  #effectFrameChange() {
    return $effect.root(() => {
      $effect(() => {
        const _ = this.frameIndex;
        this.selection = undefined;
      });
      return () => { };
    });
  }

  #debug() {
    return $effect.root(() => {
      $effect(() => {
        if (this.frame.baked && this.selection) {
          // console.log("seam vertices", getSeamVertices(this.frame.baked, this.selection));
          console.log("seam edges", getSelectionSeam(this.frame.baked, this.selection));
        }
        // console.log("Face graph", this.selectionFaceGraph);
        // console.log("frames", this.frames.length);
      });
      return () => { };
    })
  }
}

