import {
	distance2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import { graph } from "../stores/graph.js";
import { viewBox } from "../stores/app.js";
import { selected } from "../stores/select.js";
import { current } from "../stores/ui.js";

export const pointerEventEdge = (eventType) => {
	switch (eventType) {
	case "press":
		break;
	case "move":
		break;
	case "release":
		break;
	}
};
