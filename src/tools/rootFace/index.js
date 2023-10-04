import pointerEvent from "./pointerEvent.js";
// import panel from "./panel.svelte";
import icon from "./icon.svelte";
import {
	subscribe,
	unsubscribe,
	reset,
} from "./stores.js";

const rootFace = {
	key: "rootFace",
	name: "rootFace",
	group: "undefined", // "layers",
	// order: 2,
	icon,
	pointerEvent,
	// panel,
	subscribe,
	unsubscribe,
	reset,
};

export default rootFace;
