import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";

const foldAngle = {
	uuid: "foldAngle",
	name: "fold angle",
	group: "attributes",
	pointerEvent,
	panel,
};

export default foldAngle;
