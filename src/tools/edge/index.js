import pointerEvent from "./pointerEvent.js";
import keyboardEvent from "./keyboardEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";

const options = {
	postExecute: [{ func: "planarize", args: [] }],
};

// export { default as Test } from './Test.svelte';

const edge = {
	uuid: "edge",
	name: "edge",
	group: "simple",
	icon,
	pointerEvent,
	keyboardEvent,
	options,
	panel,
};

export default edge;
