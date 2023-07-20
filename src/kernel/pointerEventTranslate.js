import {
	add2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import {
	Graph,
	UIGraph,
} from "../stores/Graph.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";

let pressCoords;

export const pointerEventTranslate = (eventType, { point }) => {
	switch (eventType) {
	case "press": {
		const { coords, vertex } = getSnapPoint(point);
		pressCoords = coords;
	}
		break;
	case "move": {
		const graph = get(Graph);
		const { coords, vertex } = getSnapPoint(point);
		const vector = subtract2(coords, pressCoords);
		const vertices_coords = [...graph.vertices_coords]
			.map(coord => add2(coord, vector));
		UIGraph.set({ ...graph, vertices_coords });
	}
		break;
	case "release":
		UIGraph.set({});
		break;
	}
};
