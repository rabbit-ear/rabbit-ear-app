import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import {
	subscribe,
	unsubscribe,
} from "./stores.js";

const kawasaki = {
	key: "kawasaki",
	name: "kawasaki",
	group: "single vertex",
	icon,
	panel,
	cp: {
		pointerEvent,
		SVGLayer,
	},
	subscribe,
	unsubscribe,
};

export default kawasaki;
