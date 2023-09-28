import {
	writable,
	derived,
} from "svelte/store";
/**
 *
 */
const collapseMethods = {
	setUILines: true,
	setUIRays: true,
	setTool: true,
	resetApp: true,
	resetTool: true,
	// resetRulers: true,
	highlight: true,
	// axiom1Preview: true,
	// axiom2Preview: true,
	// axiom3Preview: true,
	// axiom4Preview: true,
	// axiom5Preview: true,
	// axiom6Preview: true,
	// axiom7Preview: true,
	pleatPreview: true,
	foldedLinePreview: true,
	kawasakiRulerPreviews: true,
};
const containsCollapsible = (commands) => commands
	.map(name => collapseMethods[name])
	.reduce((a, b) => a || b, false);
/**
 *
 */
export const CommandHistory = writable([]);
/**
 *
 */
CommandHistory.add = (...args) => CommandHistory.update(history => {
	const previous = history[history.length - 1] || ({});
	if (containsCollapsible(args.flatMap(el => el.commands || []))
		&& containsCollapsible(previous.commands || [])) {
		history.pop();
	}
	return [...history, ...args];
});

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
