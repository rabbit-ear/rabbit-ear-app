import { axiom2 } from "rabbit-ear/axioms/axiomsVecLine.js";
import { get } from "svelte/store";
// import { UIGraph } from "../stores/Graph.js";
// import { Selected } from "../stores/Select.js";
import {
	Current,
	Presses,
	Moves,
	Releases,
} from "../stores/UI.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";
import { Rulers } from "../stores/Ruler.js";

let pressCoords = undefined;
let pressVertex = undefined;

let releaseCoords = undefined;
let releaseVertex = undefined;

export const pointerEventAxiom7 = (eventType) => {
	switch (eventType) {
	case "hover": {
		const { coords, vertex } = getSnapPoint(get(Current));
		const vertices = [];
		if (vertex !== undefined) { vertices[vertex] = true; }
		// Selected.set({ ...get(Selected), vertices });
		// UIGraph.set({ vertices_coords: [coords] });
	}
		break;
	case "press": {
		const { coords, vertex } = getSnapPoint(get(Current));
		pressVertex = vertex;
		pressCoords = coords;
		releaseCoords = [...coords];
		const result = axiom2(pressCoords, releaseCoords);
		if (result) {
			Rulers.set(result);
		}
		const vertices = [];
		if (vertex !== undefined) { vertices[vertex] = true; }
		// Selected.set({ ...get(Selected), vertices });
	}
		break;
	case "move": {
		const { coords, vertex } = getSnapPoint(get(Current));
		releaseVertex = vertex;
		releaseCoords = coords;
		const result = axiom2(pressCoords, releaseCoords);
		if (result) {
			Rulers.set(result);
		}
		const vertices = [];
		if (pressVertex !== undefined) { vertices[pressVertex] = true; }
		if (releaseVertex !== undefined) { vertices[releaseVertex] = true; }
		// Selected.set({ ...get(Selected), vertices });
	}
		break;
	case "release":
		const { coords } = getSnapPoint(get(Current));
		releaseCoords = coords;
		const result = axiom2(pressCoords, releaseCoords);
		if (result) {
			Rulers.set(result);
		}
		Presses.set([]);
		Moves.set([]);
		Releases.set([]);
		// UIGraph.set({});
		break;
	}
};
