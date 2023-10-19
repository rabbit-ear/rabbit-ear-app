import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import {
	reset,
	subscribe,
	unsubscribe,
} from "./stores.js";

const axiom7 = {
	key: "axiom7",
	name: "axiom 7",
	group: "lines",
	icon,
	panel,
	cp: {
		pointerEvent,
		SVGLayer,
	},
	reset,
	subscribe,
	unsubscribe,
};

export default axiom7;
