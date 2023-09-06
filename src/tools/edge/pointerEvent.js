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

const pointerEventEdge = (eventType, { point }) => {
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
	case "move":
		UIGraph.set({
			vertices_coords: [pressCoords, coords],
			edges_vertices: [[0, 1]],
		});
	break;
	case "release":
		execute("addEdge",
			execute("addVertex", pressCoords),
			execute("addVertex", coords),
		);
		Presses.set([]);
		RulerLines.set([]);
		RulerRays.set([]);
		UIGraph.set({ vertices_coords: [coords] });
	break;
	}
};

export default pointerEventEdge;
