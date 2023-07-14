import {
	distance2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import { UIGraph } from "../stores/Graph.js";
import {
	Current,
	Presses,
	Moves,
	Releases,
} from "../stores/UI.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";

let pressVertex = undefined;
let releaseVertex = undefined;
let pressCoords = undefined;
let releaseCoords = undefined;

export const pointerEventEdge = (eventType) => {
	switch (eventType) {
	case "press": {
		// const coords = get(Current);
		const { coords, vertex } = getSnapPoint(get(Current));
		pressVertex = vertex
		releaseVertex = vertex
		pressCoords = coords;
		releaseCoords = [...coords];
		UIGraph.set({
			vertices_coords: [pressCoords, releaseCoords],
			edges_vertices: [[0, 1]],
		});
	}
		break;
	case "move": {
		const { coords, vertex } = getSnapPoint(get(Current));
		releaseVertex = vertex
		releaseCoords = coords;
		UIGraph.set({
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
		Presses.set([]);
		Moves.set([]);
		Releases.set([]);
		UIGraph.set({});
		break;
	}
};
