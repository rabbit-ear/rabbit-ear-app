import {
	writable,
	derived,
} from "svelte/store";
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
