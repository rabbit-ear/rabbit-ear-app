import type { FOLD, FOLDChildFrame } from "rabbit-ear/types.js";
import type { FrameAttributes } from "./FrameAttributes.ts";
import { flattenFrameInArray } from "../general/fold.ts";
import { makeFrameAttributes } from "./FrameAttributes.ts";
import { ShapeManager } from "../shapes/ShapeManager.svelte.ts";
import { makeUUID } from "../general/uuid.ts";

export class Frame {
  uuid: string;

  // taken from the "raw" frames (not collapsed if inherits from a parent)
  source: FOLDChildFrame = {};

  // some frames inherit from a parent and need to be "collapsed" to be complete.
  // this frame is either identical to "source", or if this frame inherits
  // from another, then this frame will be fully realized and self-contained.
  baked: FOLD = {};

  // style-related properties for every frame, like is it 2D, folded, etc..
  attributes: FrameAttributes;

  shapeManager: ShapeManager;

  constructor(frames: FOLDChildFrame[], index: number) {
    this.uuid = makeUUID();
    this.source = frames[index];
    this.baked = flattenFrameInArray(frames, index);
    this.attributes = makeFrameAttributes(this.source, this.baked);
    this.shapeManager = new ShapeManager(); // this.source);
  }
}

