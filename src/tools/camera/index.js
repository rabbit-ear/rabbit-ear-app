import pointerEvent from "./pointerEvent.js";
// import panel from "./panel.svelte";
import icon from "./icon.svelte";
import {
	subscribe,
	unsubscribe,
} from "./stores.js";

const camera = {
	key: "camera",
	name: "camera",
	group: "general",
	order: 3,
	icon,
	pointerEvent,
	// panel,
	subscribe,
	unsubscribe,
};

export default camera;
