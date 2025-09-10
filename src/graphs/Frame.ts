import type { FOLD, FOLDChildFrame } from "rabbit-ear/types.js";
import type { FrameAttributes } from "./FrameAttributes.ts";
import type { FOLDSelection } from "../general/selection.ts";
import { RulerManager } from "../rulers/RulerManager.svelte.ts";
// import { ShapeManager } from "../shapes/ShapeManager.svelte.ts";
// import { flattenFrameInArray } from "../general/fold.ts";
import { makeUUID } from "../general/uuid.ts";
import { makeFrameAttributes } from "./FrameAttributes.ts";

export class Frame {
  uuid: string;

  // taken from the "raw" frames (not collapsed if inherits from a parent)
  source: FOLDChildFrame = {};

  // some frames inherit from a parent and need to be "collapsed" to be complete.
  // this frame is either identical to "source", or if this frame inherits
  // from another, then this frame will be fully realized and self-contained.
  graph: FOLD = {};

  // style-related properties for every frame, like is it 2D, folded, etc..
  attributes: FrameAttributes;

  rulers: RulerManager;

  // selection?: FOLDSelection = $state();
  selection?: FOLDSelection;

  constructor(frame: FOLD) {
    this.uuid = makeUUID();
    this.source = frame;
    this.graph = frame;
    this.attributes = makeFrameAttributes(this.source, this.graph);
    this.rulers = new RulerManager();
  }
}

