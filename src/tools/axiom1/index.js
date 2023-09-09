import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import * as stores from "./stores.js";
import icon from "./icon.svelte";

const axiom1 = {
	key: "axiom1",
	name: "axiom 1",
	group: "lines",
	icon,
	pointerEvent,
	panel,
	stores,
};

export default axiom1;
