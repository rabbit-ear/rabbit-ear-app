import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import {
	subscribe,
	unsubscribe,
} from "./stores.js";

const edge = {
	key: "edge",
	name: "edge",
	group: "simple",
	order: 2,
	icon,
	pointerEvent,
	SVGLayer,
	panel,
	subscribe,
	unsubscribe,
};

export default edge;
