import { cpPointerEvent, foldedPointerEvent } from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import { reset, subscribe, unsubscribe } from "./stores.js";

const pleat = {
	key: "pleat",
	name: "pleat",
	group: "many lines",
	icon,
	panel,
	cp: {
		pointerEvent: cpPointerEvent,
	},
	folded: {
		pointerEvent: foldedPointerEvent,
	},
	reset,
	subscribe,
	unsubscribe,
};

export default pleat;
