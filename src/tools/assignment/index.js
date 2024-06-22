import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import { subscribe, unsubscribe } from "./stores.js";

const assignment = {
	key: "assignment",
	name: "assignment",
	group: "attributes",
	icon,
	cp: {
		pointerEvent,
	},
	panel,
	subscribe,
	unsubscribe,
};

export default assignment;
