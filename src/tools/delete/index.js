import pointerEvent from "./pointerEvent.js";
import icon from "./icon.svelte";
import {
	subscribe,
	unsubscribe,
} from "./stores.js";

const deleteTool = {
	key: "deleteTool",
	name: "delete",
	group: "general",
	order: 2,
	icon,
	cp: {
		pointerEvent,
	},
	subscribe,
	unsubscribe,
};

export default deleteTool;
