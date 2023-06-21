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
import { didTouchVertex } from "../js/nearest.js";
import { execute } from "./app.js";

let pressVertex = undefined;
let releaseVertex = undefined;
let pressCoords = undefined;
let releaseCoords = undefined;

export const pointerEventEdge = (eventType) => {
	switch (eventType) {
	case "press": {
		const coords = get(current);
		pressVertex = didTouchVertex(coords);
		releaseVertex = pressVertex;
		pressCoords = pressVertex === undefined
			? [...coords]
			: get(graph).vertices_coords[pressVertex]
		releaseCoords = [...pressCoords];
		uiGraph.set({
			vertices_coords: [pressCoords, releaseCoords],
			edges_vertices: [[0, 1]],
		});
	}
		break;
	case "move": {
		const coords = get(current);
		releaseVertex = didTouchVertex(coords);
		releaseCoords = releaseVertex === undefined
			? [...coords]
			: get(graph).vertices_coords[releaseVertex];
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
