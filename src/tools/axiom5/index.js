import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import {
	reset,
	subscribe,
	unsubscribe,
} from "./stores.js";

const axiom5 = {
	key: "axiom5",
	name: "axiom 5",
	group: "simple",
	order: 15,
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

export default axiom5;
