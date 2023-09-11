import pointerEvent from "./pointerEvent.js";
import keyboardEvent from "./keyboardEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";

const options = {
	postExecute: [{ func: "planarize", args: [] }],
};

const edge = {
	key: "edge",
	name: "edge",
	group: "simple",
	order: 2,
	icon,
	pointerEvent,
	keyboardEvent,
	options,
	panel,
};

export default edge;
