import { get } from "svelte/store";
import {
	Keyboard,
	Presses,
	UIGraph,
} from "../stores/UI.js";
import { RulerLines } from "../stores/Ruler.js";
import { snapToPoint } from "../js/snap.js";
import { execute } from "./app.js";

let pressCoords = undefined;

export const pointerEventEdge = (eventType, { point }) => {
	const coords = snapToPoint(point, false);
	switch (eventType) {
	case "hover":
		UIGraph.set({ vertices_coords: [coords] });
	break;
	case "press":
		pressCoords = coords;
		Presses.set([pressCoords]);
		if (get(Keyboard)[16]) { // Shift
			execute("radialRulers", pressCoords);
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
		UIGraph.set({ vertices_coords: [coords] });
	break;
	}
};
