import pointerEvent from "./pointerEvent.js";
import icon from "./icon.svelte";
import { subscribe, unsubscribe } from "./stores.js";

const rabbitEar = {
	key: "rabbitEar",
	name: "rabbit ear",
	group: "many lines",
	icon,
	cp: {
		pointerEvent,
	},
	subscribe,
	unsubscribe,
};

export default rabbitEar;
