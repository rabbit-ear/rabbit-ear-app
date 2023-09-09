import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";

const selectTool = {
	uuid: "select",
	name: "select",
	group: "general",
	icon,
	pointerEvent,
	panel,
	SVGLayer,
};

export default selectTool;
