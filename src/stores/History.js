import { writable, derived } from "svelte/store";
import { arrayIntersection } from "../js/arrays.js";
import { TerminalValue } from "./App.js";
/**
 * @description On boot or after the history is cleared,
 * terminal will pad the history with empty new lines
 * until it reaches at least this many. The reason for this
 * is because the text container is top-justified, and when
 * only one command is added we want the command to be at the bottom.
 * Technically, this operates on TerminalHistory, not CommandHistory.
 */
const minLineCount = 8;
/**
 * @description Terminal will only save the most recent N number of commands
 * in its history.
 * Technically, this operates on CommandHistory, not TerminalHistory.
 */
const maxLineCount = 300;
/**
 * @description When a history is appended to the command history,
 * in the case that the new history item is the exact same command
 * as the most recent history item, then the terminal history is capable
 * of collapsing the history so that the new method replaces the most
 * recent history item; if the method is one of the methods in this list.
 */
const collapseMethods = {
	setGuideLinesCP: true,
	setGuideRaysCP: true,
	setGuideSegmentsCP: true,
	setGuideLinesFolded: true,
	setGuideRaysFolded: true,
	setGuideSegmentsFolded: true,
	setGhostGraphCP: true,
	setGhostGraphFolded: true,
	setTool: true,
	resetTool: true,
	highlight: true,
	pleatPreview: true,
	foldedLinePreview: true,
};
/**
 *
 */
const filterCollapsible = (commands = []) =>
	commands.filter((name) => collapseMethods[name]);
/**
 * @description The history of commands and their arguments. This will
 * appear in the terminal output.
 */
export const CommandHistory = writable([]);
/**
 * @description Use this method to add new items to the command history.
 * This method will ensure the array length is maintained, and this method
 * will filter any collapsible methods.
 */
CommandHistory.add = (...args) =>
	CommandHistory.update((history) => {
		const previousEntry = history[history.length - 1] || {};
		const curr = filterCollapsible(args.flatMap((el) => el.commands || []));
		const prev = filterCollapsible(previousEntry.commands);
		if (arrayIntersection(curr, prev).length) {
			history.pop();
		}
		const result = [...history, ...args];
		if (result.length > maxLineCount) {
			result.splice(0, result.length - maxLineCount);
		}
		TerminalValue.set("");
		ReplayCommandIndex.set(0);
		return result;
	});
/**
 *
 */
export const ReplayCommandIndex = writable(0);
ReplayCommandIndex.increment = () => ReplayCommandIndex.update((n) => n + 1);
ReplayCommandIndex.decrement = () => ReplayCommandIndex.update((n) => n - 1);
/**
 *
 */
export const ReplayCommand = derived(
	[CommandHistory, ReplayCommandIndex],
	([$CommandHistory, $ReplayCommandIndex]) => {
		let absIndex = $ReplayCommandIndex;
		while (absIndex < 0) {
			absIndex += $CommandHistory.length;
		}
		while (absIndex >= $CommandHistory.length) {
			absIndex -= $CommandHistory.length;
		}
		return $CommandHistory[absIndex];
	},
	"",
);
/**
 * @description A derived state of the CommandHistory, where each item
 * is converted into an HTML string inside of a span element.
 */
export const TerminalHistory = derived(
	CommandHistory,
	($CommandHistory) =>
		$CommandHistory.length >= minLineCount
			? $CommandHistory
			: Array(minLineCount - $CommandHistory.length)
					.fill({ html: "<span></span>" })
					.concat($CommandHistory),
	[],
);
