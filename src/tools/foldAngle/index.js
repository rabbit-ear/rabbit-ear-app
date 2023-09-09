import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";

const foldAngle = {
	uuid: "foldAngle",
	name: "fold angle",
	group: "attributes",
	icon,
	pointerEvent,
	panel,
};

export default foldAngle;
