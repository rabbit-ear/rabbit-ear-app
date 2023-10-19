import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import {
	reset,
	subscribe,
	unsubscribe,
} from "./stores.js";

const axiom4 = {
	key: "axiom4",
	name: "axiom 4",
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

export default axiom4;
