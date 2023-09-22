import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import {
	subscribe,
	unsubscribe,
	reset,
} from "./stores.js";

const scale = {
	key: "scale",
	name: "scale",
	group: "transform",
	order: 2,
	icon,
	pointerEvent,
	panel,
	SVGLayer,
	subscribe,
	unsubscribe,
	reset,
};

export default scale;
