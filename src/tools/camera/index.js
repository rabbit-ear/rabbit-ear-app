import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";

const camera = {
	uuid: "camera",
	name: "camera",
	group: "general",
	icon,
	pointerEvent,
	panel,
};

export default camera;
