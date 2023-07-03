import {
	distance2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import {
	graph,
	uiGraph,
} from "../stores/graph.js";
import { viewBox } from "../stores/app.js";
import { selected } from "../stores/select.js";
import {
	current,
	presses,
	moves,
	releases,
} from "../stores/ui.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";

let pressVertex = undefined;
let releaseVertex = undefined;
let pressCoords = undefined;
let releaseCoords = undefined;

export const pointerEventEdge = (eventType) => {
	switch (eventType) {
	case "press": {
		// const coords = get(current);
		const { coords, vertex } = getSnapPoint(get(current));
		pressVertex = vertex
		releaseVertex = vertex
		pressCoords = coords;
		releaseCoords = [...coords];
		uiGraph.set({
			vertices_coords: [pressCoords, releaseCoords],
			edges_vertices: [[0, 1]],
		});
	}
		break;
	case "move": {
		const { coords, vertex } = getSnapPoint(get(current));
		releaseVertex = vertex
		releaseCoords = coords;
		uiGraph.set({
			vertices_coords: [pressCoords, releaseCoords],
			edges_vertices: [[0, 1]],
		});
	}
		break;
	case "release":
		if (pressVertex === undefined) {
			pressVertex = execute("addVertex", pressCoords);
		}
		if (releaseVertex === undefined) {
			releaseVertex = execute("addVertex", releaseCoords);
		}
		execute("addEdge", pressVertex, releaseVertex);
		presses.set([]);
		moves.set([]);
		releases.set([]);
		uiGraph.set({});
		break;
	}
};
