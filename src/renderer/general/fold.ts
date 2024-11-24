import type { FOLD, FOLDChildFrame } from "rabbit-ear/types.d.ts";
import { flattenFrame } from "rabbit-ear/fold/frames.js";

/**
 * @description a FOLD object with frames is arranged such that
 * the top level is frame [0], and frames 1...N-1 are inside of
 * an array under the key "file_frames". This method converts
 * a flat array of frames into a FOLD object with "file_frames".
 */
export const reassembleFramesToFOLD = (frames): FOLD => {
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
