import type { FOLD, FOLDChildFrame } from "rabbit-ear/types.js";
import type { FrameAttributes } from "./FrameAttributes.ts";
import { flattenFrameInArray } from "../general/fold.ts";
import { makeFrameAttributes } from "./FrameAttributes.ts";
import { ShapeManager } from "../shapes/ShapeManager.svelte.ts";

export class Frame {
  // which frame is currently selected by the app for rendering/modification
  // taken from the "raw" frames (not collapsed if inherits from a parent)
  // source: FOLDChildFrame = $state({});
  source: FOLDChildFrame = {};

  // which frame is currently selected by the app for rendering/modification
  // baked: FOLD = $state({});
  baked: FOLD = {};

  // style-related properties for every frame, like is it 2D, folded, etc..
  // attributes: FrameAttributes = $derived
  //   .by(() => makeFrameAttributes(this.baked));
  attributes: FrameAttributes;

  shapeManager: ShapeManager;

  constructor(frames: FOLDChildFrame[], index: number) {
    this.source = frames[index];
    this.baked = flattenFrameInArray(frames, index);
    this.attributes = makeFrameAttributes(this.baked);
    this.shapeManager = new ShapeManager();
  }
}

