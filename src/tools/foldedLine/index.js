import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";

const foldedLine = {
	uuid: "foldedLine",
	name: "folded line",
	group: "many lines",
	icon,
	pointerEvent,
	panel,
};

export default foldedLine;
