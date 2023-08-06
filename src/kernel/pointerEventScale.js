import {
	distance2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import { Graph } from "../stores/Model.js";
import { UIGraph } from "../stores/UI.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";

let pressCoords = undefined;
let releaseCoords = undefined;

export const pointerEventScale = (eventType, { point }) => {
	switch (eventType) {
	case "press": {
		const { coords, vertex } = getSnapPoint(point);
		pressCoords = coords;
	}
		break;
	case "move": {
		const graph = get(Graph);
		const { coords, vertex } = getSnapPoint(point);
		releaseCoords = coords;
		const ratio = [
			releaseCoords[0] / pressCoords[0],
			releaseCoords[1] / pressCoords[1],
		];
		console.log("ra", ratio);
		const vector = (Number.isFinite(ratio[0]) && Number.isFinite(ratio[1])
			? ratio
			: [1, 1]);
		const vertices_coords = [...graph.vertices_coords]
			.map(coords => coords.map((n, i) => n * vector[i]));
		UIGraph.set({ ...graph, vertices_coords });
	}
		break;
	case "release":
		UIGraph.set({});
		break;
	}
};
