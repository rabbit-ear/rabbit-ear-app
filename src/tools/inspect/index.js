import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import { subscribe, unsubscribe } from "./stores.js";

const inspect = {
	key: "inspect",
	name: "inspect",
	group: "general",
	order: 3,
	icon,
	panel,
	cp: {
		pointerEvent,
	},
	subscribe,
	unsubscribe,
};

export default inspect;
