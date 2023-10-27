import {
	cpPointerEvent,
	foldedPointerEvent,
} from "./pointerEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import CPSVGLayer from "./CPSVGLayer.svelte";
import {
	subscribe,
	unsubscribe,
} from "./stores.js";

const arc = {
	key: "arc",
	name: "arc",
	group: "simple",
	order: 4,
	icon,
	panel,
	cp: {
		pointerEvent: cpPointerEvent,
		SVGLayer: CPSVGLayer,
	},
	folded: {
		pointerEvent: foldedPointerEvent,
		SVGLayer: CPSVGLayer,
	},
	subscribe,
	unsubscribe,
};

export default arc;
