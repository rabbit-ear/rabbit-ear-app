import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import {
	subscribe,
	unsubscribe,
} from "./stores.js";

const selectTool = {
	key: "select",
	name: "select",
	group: "general",
	order: 1,
	icon,
	pointerEvent,
	panel,
	SVGLayer,
	subscribe,
	unsubscribe,
};

export default selectTool;
