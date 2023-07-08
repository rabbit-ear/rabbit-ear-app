import { axiom2 } from "rabbit-ear/axioms/axiomsVecLine.js";
import { get } from "svelte/store";
// import { uiGraph } from "../stores/graph.js";
import { selected } from "../stores/select.js";
import {
	current,
	presses,
	moves,
	releases,
} from "../stores/ui.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";
import { rulerLines } from "../stores/ruler.js";

let pressCoords = undefined;
let pressVertex = undefined;

let releaseCoords = undefined;
let releaseVertex = undefined;

export const pointerEventAxiom2 = (eventType) => {
	switch (eventType) {
	case "hover": {
		const { coords, vertex } = getSnapPoint(get(current));
		const vertices = [];
		if (vertex !== undefined) { vertices[vertex] = true; }
		selected.set({ ...get(selected), vertices });
		// uiGraph.set({ vertices_coords: [coords] });
	}
		break;
	case "press": {
		const { coords, vertex } = getSnapPoint(get(current));
		pressVertex = vertex;
		pressCoords = coords;
		releaseCoords = [...coords];
		const result = axiom2(pressCoords, releaseCoords);
		if (result) {
			rulerLines.set(result);
		}
		const vertices = [];
		if (vertex !== undefined) { vertices[vertex] = true; }
		selected.set({ ...get(selected), vertices });
	}
		break;
	case "move": {
		const { coords, vertex } = getSnapPoint(get(current));
		releaseVertex = vertex;
		releaseCoords = coords;
		const result = axiom2(pressCoords, releaseCoords);
		if (result) {
			rulerLines.set(result);
		}
		const vertices = [];
		if (pressVertex !== undefined) { vertices[pressVertex] = true; }
		if (releaseVertex !== undefined) { vertices[releaseVertex] = true; }
		selected.set({ ...get(selected), vertices });
	}
		break;
	case "release":
		const { coords } = getSnapPoint(get(current));
		releaseCoords = coords;
		const result = axiom2(pressCoords, releaseCoords);
		if (result) {
			rulerLines.set(result);
		}
		presses.set([]);
		moves.set([]);
		releases.set([]);
		// uiGraph.set({});
		break;
	}
};
