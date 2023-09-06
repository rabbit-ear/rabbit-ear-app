import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";

const selectTool = {
	uuid: "select",
	name: "select",
	pointerEvent,
	panel,
};

export default selectTool;
