import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import {
	subscribe,
	unsubscribe,
	reset,
} from "./stores.js";

const translate = {
	key: "translate",
	name: "translate",
	group: "transform",
	order: 1,
	icon,
	panel,
	cp: {
		pointerEvent,
		SVGLayer,
	},
	subscribe,
	unsubscribe,
	reset,
};

export default translate;
