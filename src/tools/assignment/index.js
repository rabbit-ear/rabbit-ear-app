import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import {
	subscribe,
	unsubscribe,
} from "./stores.js";

const assignment = {
	uuid: "assignment",
	name: "assignment",
	group: "attributes",
	icon,
	pointerEvent,
	panel,
	subscribe,
	unsubscribe,
};

export default assignment;
