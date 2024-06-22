import { cpPointerEvent, foldedPointerEvent } from "./pointerEvent.js";
import { keyboardEvent } from "./keyboardEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import CPSVGLayer from "./CPSVGLayer.svelte";
import FoldedSVGLayer from "./FoldedSVGLayer.svelte";
import { subscribe, unsubscribe } from "./stores.js";

const edge = {
	key: "edge",
	name: "edge",
	group: "simple",
	order: 2,
	icon,
	cp: {
		pointerEvent: cpPointerEvent,
		SVGLayer: CPSVGLayer,
	},
	folded: {
		pointerEvent: foldedPointerEvent,
		SVGLayer: FoldedSVGLayer,
	},
	keyboardEvent,
	panel,
	subscribe,
	unsubscribe,
};

export default edge;
