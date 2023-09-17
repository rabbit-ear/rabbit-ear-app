import {
	get,
	writable,
	derived,
} from "svelte/store";
import {
	Frames,
	FrameIndex,
} from "./Model.js";
import { UndoHistoryLength } from "./App.js";
import { Selection } from "./Select.js";
/**
 * @description
 */
export const FileHistory = writable([]);
/**
 *
 */
FileHistory.add = (item) => FileHistory.update((history) => {
	const newHistory = [...history, item];
	if (newHistory.length > UndoHistoryLength) {
		newHistory.shift();
	}
	return newHistory;
});
/**
 *
 */
FileHistory.cache = () => FileHistory
	.add(structuredClone(get(Frames)));
/**
 *
 */
FileHistory.undo = () => FileHistory.update((history) => {
	const frames = history.pop();
	// should mimic LoadFile, in terms of what gets reset.
	if (frames) {
		Selection.reset();
		FrameIndex.update(index => Math.max(index, frames.length - 1));
		Frames.set(frames);
	}
	return history;
	// return [...history];
});
/**
 * todo
 */
FileHistory.redo = () => FileHistory.update((history) => history);
/**
 *
 */
export const CommandHistory = writable([]);
CommandHistory.add = (newHistory => {});

// todo: make .add method have a collapsing-history option where,
// under certain method calls, the newest history replaces the previous one
// because they will be happening repeatedly, and the information is
// not important.

const minLineCount = 8;

export const TerminalHistory = derived(
	CommandHistory,
	($CommandHistory) => $CommandHistory.length >= minLineCount
		? $CommandHistory
		: Array(minLineCount - $CommandHistory.length)
			.fill({ html: "<span></span>" })
			.concat($CommandHistory),
	[],
);
