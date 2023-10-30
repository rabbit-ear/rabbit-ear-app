import {
	cpPointerEvent,
	foldedPointerEvent,
} from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import CPSVGLayer from "./CPSVGLayer.svelte";
import FoldedSVGLayer from "./FoldedSVGLayer.svelte";
import {
	reset,
	subscribe,
	unsubscribe,
} from "./stores.js";

const axiom3 = {
	key: "axiom3",
	name: "axiom 3",
	group: "simple",
	order: 13,
	icon,
	panel,
	cp: {
		pointerEvent: cpPointerEvent,
		SVGLayer: CPSVGLayer,
	},
	folded: {
		pointerEvent: foldedPointerEvent,
		SVGLayer: FoldedSVGLayer,
	},
	reset,
	subscribe,
	unsubscribe,
};

export default axiom3;
