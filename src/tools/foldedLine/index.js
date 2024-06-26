import pointerEvent from "./pointerEvent.js";
// import panel from "./panel.svelte";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import { subscribe, unsubscribe } from "./stores.js";

const foldedLine = {
	key: "foldedLine",
	name: "folded line",
	group: "many lines",
	icon,
	// panel,
	cp: {
		pointerEvent,
		SVGLayer,
	},
	subscribe,
	unsubscribe,
};

export default foldedLine;
