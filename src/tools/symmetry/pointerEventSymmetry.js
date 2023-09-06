import { get } from "svelte/store";
import { subtract2 } from "rabbit-ear/math/vector.js";
import {
	CurrentSnap,
	Keyboard,
	Presses,
	UIGraph,
} from "../stores/UI.js";
import { SymmetryLines } from "../stores/Symmetry.js";
import {
	RadialSnapDegrees,
	RadialSnapOffset,
} from "../stores/Tool.js";
import {
	snapToPoint,
	snapToRulerLine,
} from "../js/snap.js";
import execute from "./execute.js";

let pressCoords;

export const pointerEventSymmetry = (eventType, { point }) => {
	// const coords = shift
	// 	? snapToRulerLine(point).coords
	// 	: snapToPoint(point, false);
	const coords = snapToPoint(point, false);
	switch (eventType) {
	case "hover":
		UIGraph.set({ vertices_coords: [coords] });
	break;
	case "press":
		pressCoords = coords;
		SymmetryLines.add({ vector: [1, 0], origin: coords });
		Presses.set([pressCoords]);
		UIGraph.set({ vertices_coords: [coords] });
	break;
	case "move":
		UIGraph.set({ vertices_coords: [pressCoords, coords] });
		SymmetryLines.update(lines => {
			lines[lines.length - 1].vector = subtract2(coords, pressCoords);
			return lines;
		});
	break;
	case "release":
		SymmetryLines.update(lines => {
			lines[lines.length - 1].vector = subtract2(coords, pressCoords);
			return lines;
		});
		Presses.set([]);
		UIGraph.set({ vertices_coords: [coords] });
	break;
	}
};
