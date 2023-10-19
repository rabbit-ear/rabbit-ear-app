import pointerEvent from "./pointerEvent.js";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import {
	subscribe,
	unsubscribe,
} from "./stores.js";

const vertex = {
	key: "vertex",
	name: "vertex",
	group: "simple",
	order: 1,
	icon,
	cp: {
		pointerEvent,
		SVGLayer,
	},
	subscribe,
	unsubscribe,
};

export default vertex;
