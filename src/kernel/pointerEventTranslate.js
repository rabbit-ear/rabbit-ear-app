import {
	add2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import {
	Graph,
	UIGraph,
} from "../stores/Graph.js";
import {
	Current,
	Presses,
	Moves,
	Releases,
} from "../stores/UI.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";

let pressCoords = undefined;
let releaseCoords = undefined;

export const pointerEventTranslate = (eventType) => {
	switch (eventType) {
	case "press": {
		const { coords, vertex } = getSnapPoint(get(Current));
		pressCoords = coords;
	}
		break;
	case "move": {
		const g = get(Graph);
		const { coords, vertex } = getSnapPoint(get(Current));
		releaseCoords = coords;
		const vector = subtract2(releaseCoords, pressCoords);
		const vertices_coords = [...g.vertices_coords]
			.map(coord => add2(coord, vector));
		UIGraph.set({ ...g, vertices_coords });
	}
		break;
	case "release":
		Presses.set([]);
		Moves.set([]);
		Releases.set([]);
		UIGraph.set({});
		break;
	}
};
