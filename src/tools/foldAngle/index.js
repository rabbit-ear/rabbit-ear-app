import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import {
	subscribe,
	unsubscribe,
} from "./stores.js";

const foldAngle = {
	key: "foldAngle",
	name: "fold angle",
	group: "attributes",
	icon,
	panel,
	cp: {
		pointerEvent,
	},
	subscribe,
	unsubscribe,
};

export default foldAngle;
