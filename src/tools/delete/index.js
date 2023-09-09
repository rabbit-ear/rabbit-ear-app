import pointerEvent from "./pointerEvent.js";
// import panel from "./panel.svelte";
import icon from "./icon.svelte";

const deleteTool = {
	key: "deleteTool",
	name: "delete",
	group: "general",
	icon,
	pointerEvent,
	// panel,
};

export default deleteTool;
