import { get } from "svelte/store";
import {
	Frames,
	FrameIndex,
} from "../../stores/Model.js";

export const appendFrame = (frame) => {
	Frames.update(frames => [...frames, frame]);
	FrameIndex.set(get(Frames).length - 1);
};

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
