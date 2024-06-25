import { cpPointerEvent, foldedPointerEvent } from "./pointerEvent.js";
import icon from "./icon.svelte";
import { subscribe, unsubscribe } from "./stores.js";

const camera = {
	key: "camera",
	name: "camera",
	group: "general",
	order: 2,
	icon,
	cp: {
		pointerEvent: cpPointerEvent,
	},
	folded: {
		pointerEvent: foldedPointerEvent,
	},
	subscribe,
	unsubscribe,
};

export default camera;
