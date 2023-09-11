import pointerEvent from "./pointerEvent.js";
// import panel from "./panel.svelte";
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
	pointerEvent,
	SVGLayer,
	subscribe,
	unsubscribe,
	// panel,
};

export default vertex;
