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

let pressCoords = undefined;
let releaseCoords = undefined;

export const pointerEventScale = (eventType) => {
	switch (eventType) {
	case "press": {
		const coords = get(current);
		const pressVertex = didTouchVertex(coords);
		pressCoords = pressVertex === undefined
			? [...coords]
			: get(graph).vertices_coords[pressVertex];
	}
		break;
	case "move": {
		const g = get(graph);
		const coords = get(current);
		const releaseVertex = didTouchVertex(coords);
		releaseCoords = releaseVertex === undefined
			? [...coords]
			: g.vertices_coords[releaseVertex];
		const ratio = [
			releaseCoords[0] / pressCoords[0],
			releaseCoords[1] / pressCoords[1],
		];
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
