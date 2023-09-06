import { get } from "svelte/store";
import {
	CurrentSnap,
	Keyboard,
	Presses,
	UIGraph,
} from "../../stores/UI.js";
import {
	RulerLines,
	RulerRays,
} from "../../stores/Ruler.js";
import {
	RadialSnapDegrees,
	RadialSnapOffset,
} from "../../stores/Tool.js";
import {
	snapToPoint,
	snapToRulerLine,
} from "../../js/snap.js";
import execute from "../../kernel/execute.js";

let pressCoords = undefined;

const pointerEventFoldLine = (eventType, { point }) => {
	const shift = get(Keyboard)[16];
	const coords = shift
		? snapToRulerLine(point).coords
		: snapToPoint(point, false);
	CurrentSnap.set(coords);
	switch (eventType) {
	case "hover":
		UIGraph.set({ vertices_coords: [coords] });
	break;
	case "press":
		pressCoords = coords;
		Presses.set([pressCoords]);
		if (shift) { // Shift
			execute("radialRulers",
				pressCoords,
				get(RadialSnapDegrees),
				get(RadialSnapOffset),
			);
		}
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

export default pointerEventFoldLine;
