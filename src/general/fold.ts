import type { FOLD, FOLDChildFrame } from "rabbit-ear/types.d.ts";
import { flattenFrame } from "rabbit-ear/fold/frames.js";
import { filterKeysWithPrefix } from "rabbit-ear/fold/spec.js";
import { clone } from "rabbit-ear/general/clone.js";

// modifies input list in place
export const prepareFOLDNonSpecData = (frames: FOLDChildFrame[]): FOLDChildFrame[] => {
  frames
    .filter(frame => frame.frame_inherit)
    .map(frame => frame.frame_parent)
    .filter(index => index !== undefined)
    .forEach(index => { frames[index]["ear:isParent"] = true });
  return frames;
};

/**
 * @description a FOLD object with frames is arranged such that
 * the top level is frame [0], and frames 1...N-1 are inside of
 * an array under the key "file_frames". This method converts
 * a flat array of frames into a FOLD object with "file_frames".
 */
export const reassembleFramesToFOLD = (frames: FOLDChildFrame[]): FOLD => {
  const fold = { ...frames[0] };
  const file_frames = frames.slice(1);
  if (file_frames.length) {
    fold.file_frames = file_frames;
  }
  return fold;
};

export const makeFlatFramesFromFrames = (frames: FOLDChildFrame[]): FOLD[] => {
  try {
    const fold = reassembleFramesToFOLD(frames);
    return frames.map((_, i) => {
      try {
        return flattenFrame(fold, i);
      } catch (errorFlatten) {
        console.log(errorFlatten);
        return {};
      }
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};


export const flattenFrameInArray = (frames: FOLDChildFrame[], frameNumber = 0): FOLD => {
  if (!frames || frames.length < frameNumber) {
    return {};
  }

  // prevent cycles. never visit a frame twice
  const visited: { [key: number]: boolean } = {};

  /**
   * @description recurse from the desired frame up through its parent
   * frames until we reach frame index 0, or a frame with no parent.
   * @param {number} currentIndex
   * @param {number[]} previousOrders
   * @returns {number[]} a list of frame indices, from parent to child.
   */
  const recurse = (currentIndex: number, previousOrders: number[]): number[] => {
    // prevent cycles
    if (visited[currentIndex]) {
      // throw new Error(Messages.graphCycle);
      throw new Error("graph contains cycles");
    }
    visited[currentIndex] = true;

    // add currentIndex to the start of the list of previous frame indices
    const thisOrders = [currentIndex].concat(previousOrders);

    // get a reference to the current frame
    /** @type {FOLDInternalFrame} */
    const frame = frames[currentIndex];

    // if the frame inherits and contains a parent, recurse
    // if not, we are done, return the list of orders.
    return frame.frame_inherit && frame.frame_parent != null
      ? recurse(frame.frame_parent, thisOrders)
      : thisOrders;
  };

  // recurse, get a list of frame indices from parent to child,
  // convert the indices into shallow copies of the frames, and
  // sequentially reduce all frames into a single frame object.
  const flattened = recurse(frameNumber, [])
    .map((frameNum: number) => frames[frameNum])
    .reduce((a, b) => ({ ...a, ...b }));

  // this is optional, but this ensures that this method can be treated
  // "functionally" and using this method will not cause any side effects
  return clone(flattened);
  // return flattened;
};

