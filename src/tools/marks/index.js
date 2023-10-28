import {
	cpPointerEvent,
	foldedPointerEvent,
} from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import CPSVGLayer from "./CPSVGLayer.svelte";
import FoldedSVGLayer from "./FoldedSVGLayer.svelte";
import {
	subscribe,
	unsubscribe,
} from "./stores.js";

const marks = {
	key: "marks",
	name: "marks",
	group: "undefined",
	// order: 4,
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
	subscribe,
	unsubscribe,
};

export default marks;
