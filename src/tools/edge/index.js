import {
	cpPointerEvent,
	foldedPointerEvent,
} from "./pointerEvent.js";
import { keyboardEvent } from "./keyboardEvent.js";
import panel from "./panel.svelte";
import icon from "./icon.svelte";
import cpSVGLayer from "./cpSVGLayer.svelte";
import foldedSVGLayer from "./foldedSVGLayer.svelte";
import {
	subscribe,
	unsubscribe,
} from "./stores.js";

const edge = {
	key: "edge",
	name: "edge",
	group: "simple",
	order: 2,
	icon,
	cp: {
		pointerEvent: cpPointerEvent,
		SVGLayer: cpSVGLayer,
	},
	folded: {
		pointerEvent: foldedPointerEvent,
		SVGLayer: foldedSVGLayer,
	},
	keyboardEvent,
	panel,
	subscribe,
	unsubscribe,
};

export default edge;
