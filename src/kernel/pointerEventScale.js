import {
	distance2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import {
	graph,
	uiGraph,
} from "../stores/graph.js";
import { viewBox } from "../stores/viewBox.js";
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

export const pointerEventScale = (eventType) => {
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
		const ratio = [
			releaseCoords[0] / pressCoords[0],
			releaseCoords[1] / pressCoords[1],
		];
		console.log("ra", ratio);
		const vector = (Number.isFinite(ratio[0]) && Number.isFinite(ratio[1])
			? ratio
			: [1, 1]);
		const vertices_coords = [...g.vertices_coords]
			.map(coords => coords.map((n, i) => n * vector[i]));
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
