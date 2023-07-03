import {
	add2,
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

let pressCoords = undefined;
let releaseCoords = undefined;

export const pointerEventTranslate = (eventType) => {
	switch (eventType) {
	case "press": {
		const { coords, vertex } = getSnapPoint(get(current));
		pressCoords = coords;
	}
		break;
	case "move": {
		const g = get(graph);
		const { coords, vertex } = getSnapPoint(get(current));
		releaseCoords = coords;
		const vector = subtract2(releaseCoords, pressCoords);
		const vertices_coords = [...g.vertices_coords]
			.map(coord => add2(coord, vector));
		uiGraph.set({ ...g, vertices_coords });
	}
		break;
	case "release":
		presses.set([]);
		moves.set([]);
		releases.set([]);
		uiGraph.set({});
		break;
	}
};
