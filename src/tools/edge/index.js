import pointerEvent from "./pointerEvent.js";
import keyboardEvent from "./keyboardEvent.js";
import panel from "./panel.svelte";

const options = {
	postExecute: [{ func: "planarize", args: [] }],
};

// export { default as Test } from './Test.svelte';

const edge = {
	uuid: "edge",
	name: "edge",
	pointerEvent,
	keyboardEvent,
	options,
	panel,
};

export default edge;
