import { get } from "svelte/store";
import {
	CurrentSnap,
	Keyboard,
	Presses,
	UIGraph,
} from "../stores/UI.js";
import {
	RulerLines,
	RulerRays,
} from "../stores/Ruler.js";
import {
	RadialSnapDegrees,
	RadialSnapOffset,
} from "../stores/Tool.js";
import {
	snapToPoint,
	snapToRulerLine,
} from "../js/snap.js";
import { execute } from "./app.js";

let pressCoords = undefined;

export const pointerEventFoldLine = (eventType, { point }) => {
	const coords = snapToPoint(point, false);
	CurrentSnap.set(coords);
	switch (eventType) {
	case "hover":
		UIGraph.set({ vertices_coords: [coords] });
	break;
	case "press":
		pressCoords = coords;
		Presses.set([pressCoords]);
		UIGraph.set({ vertices_coords: [coords] });
	break;
	case "move": {
		execute("repeatFoldLinePreview", pressCoords, coords);
	}
	break;
	case "release":
		execute("repeatFoldLine", pressCoords, coords);
		Presses.set([]);
		RulerLines.set([]);
		RulerRays.set([]);
		UIGraph.set({ vertices_coords: [coords] });
	break;
	}

};
