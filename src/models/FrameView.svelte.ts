import {
  identity2x3,
} from "rabbit-ear/math/matrix2.js";
import type { FOLDChildFrame } from "rabbit-ear/types.js";
// import type { FrameAttributes } from "./FrameAttributes";

export class FrameView {
  // #attributes: FrameAttributes
  // frame: FOLDChildFrame;

  model: number[] = $state([...identity2x3]);

  camera = $state([...identity2x3]);

  // showVertices: boolean = $derived.by(() => this.#attributes.isAbstract);

  // constructor(fold: FOLDChildFrame) {
  constructor() {
    // this.#attributes = attributes;
    // this.frame = fold;
  }

  // static makeFromFOLDFrame(attributes: FrameAttributes): FrameView {
  //   const settings = new FrameView();
  //   return settings;
  // }
}
