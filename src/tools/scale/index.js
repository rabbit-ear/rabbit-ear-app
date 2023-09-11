import pointerEvent from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";

const scale = {
	key: "scale",
	name: "scale",
	group: "transform",
	order: 2,
	icon,
	pointerEvent,
	panel,
};

export default scale;
