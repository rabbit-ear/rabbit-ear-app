import {
	add2,
	subtract2,
} from "rabbit-ear/math/vector.js";
import { get } from "svelte/store";
import { Graph } from "../../stores/Model.js";
import {
	Keyboard,
	UIGraph,
} from "../../stores/UI.js";
import {
	Presses,
} from "./stores.js";
import {
	snapToPoint,
	snapToRulerLine,
} from "../../js/snap.js";
import { getVerticesFromSelection } from "../../js/select.js";
import { Selection } from "../../stores/Select.js";
import { executeCommand } from "../../kernel/execute.js";

let pressCoords;

const pointerEventTranslate = (eventType, { point }) => {
	const shift = get(Keyboard)[16];
	const coords = shift
		? snapToRulerLine(point).coords
		: snapToPoint(point, false);
	switch (eventType) {
	case "hover":
		UIGraph.set({ vertices_coords: [coords] });
		break;
	case "press":
		pressCoords = coords;
		Presses.set([pressCoords]);
		// if (shift) { // Shift
		// 	executeCommand("radialRulers",
		// 		pressCoords,
		// 		get(RadialSnapDegrees),
		// 		get(RadialSnapOffset),
		// 	);
		// }
		UIGraph.set({ vertices_coords: [coords] });
		break;
	case "move":
		const graph = get(Graph);
		const vIndices = getVerticesFromSelection(graph, get(Selection));
		if (!vIndices.length) { break; }
		const vector = subtract2(coords, pressCoords);
		const vertices_coords = [...graph.vertices_coords];
		vIndices.forEach(v => {
			vertices_coords[v] = add2(vertices_coords[v], vector);
		});
		UIGraph.set({ ...graph, vertices_coords });
		break;
	case "release":
		executeCommand("translateVertices",
			getVerticesFromSelection(get(Graph), get(Selection)),
			subtract2(coords, pressCoords),
		);
		Presses.set([]);
		// RulerLines.set([]);
		// RulerRays.set([]);
		UIGraph.set({ vertices_coords: [coords] });
		break;
	}
};

export default pointerEventTranslate;
