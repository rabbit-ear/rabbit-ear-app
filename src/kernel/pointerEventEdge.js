import { UIGraph } from "../stores/Graph.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";

let pressVertex = undefined;
let releaseVertex = undefined;
let pressCoords = undefined;
let releaseCoords = undefined;

export const pointerEventEdge = (eventType, { point }) => {
	switch (eventType) {
	case "press": {
		const { coords, vertex } = getSnapPoint(point);
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
		const { coords, vertex } = getSnapPoint(point);
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
		UIGraph.set({});
		break;
	}
};
