import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import { subscribe, unsubscribe } from "./stores.js";

const rect = {
	key: "rect",
	name: "rect",
	group: "simple",
	order: 3,
	icon,
	panel,
	cp: {
		pointerEvent,
		SVGLayer,
	},
	subscribe,
	unsubscribe,
};

export default rect;
