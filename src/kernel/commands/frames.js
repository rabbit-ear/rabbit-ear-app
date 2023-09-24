import { get } from "svelte/store";
import {
	Frames,
	FrameIndex,
} from "../../stores/Model.js";
/**
 *
 */
export const appendFrame = (frame) => {
	Frames.update(frames => [...frames, frame]);
	FrameIndex.set(get(Frames).length - 1);
};
/**
 *
 */
export const deleteActiveFrame = () => {
	// todo: much more logic is necessary here.
	// search inside of frames, make sure that parent-child
	// relationships are maintained after this.
	const index = get(FrameIndex);
	Frames.update(frames => {
		if (frames.length === 1) { return frames; }
		frames.splice(index, 1);
		FrameIndex.update(i => Math.min(i, frames.length - 1));
		return frames;
	});
};
/**
 *
 */
export const duplicateActiveFrame = () => (
	appendFrame(structuredClone(get(Frames)[get(FrameIndex)]))
);
/**
 *
 */
export const moveFrameIndex = (fromIndex, toIndex) => {
	Frames.update(frames => {
		// update the frames array
		// remove the frame at index "from", splice it back in.
		const movingFrame = frames.splice(fromIndex, 1).shift();
		frames.splice(toIndex, 0, movingFrame);
		return [...frames];
	});
	// maintain frame index location to be whatever it was before the change
	FrameIndex.update(oldFrameIndex => {
		// a bit of a hack, repeat the operation above but on
		// an array of 0...N-1 indices. then find the index of the prev index.
		const indices = get(Frames).map((_, i) => i);
		const movingFrameIndex = indices.splice(fromIndex, 1).shift();
		indices.splice(toIndex, 0, movingFrameIndex);
		return indices.indexOf(oldFrameIndex);
	});
};
