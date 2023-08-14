import {
	magnitude2,
	distance2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import { Graph } from "../stores/Model.js";
import { UIGraph } from "../stores/UI.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";

let pressLength = 1;

const nonUniform = () => {
	const ratio = [
		releaseCoords[0] / pressCoords[0],
		releaseCoords[1] / pressCoords[1],
	];
	const vector = (Number.isFinite(ratio[0]) && Number.isFinite(ratio[1])
		? ratio
		: [1, 1]);
	const vertices_coords = [...graph.vertices_coords]
		.map(coords => coords.map((n, i) => n * vector[i]));
};

export const pointerEventScale = (eventType, { point }) => {
	switch (eventType) {
	case "press":
		pressLength = magnitude2(getSnapPoint(point).coords);
		break;
	case "move": {
		const length = magnitude2(getSnapPoint(point).coords);
		const ratio = length / pressLength;
		if (isNaN(ratio) || !isFinite(ratio)) { break; }
		const graph = get(Graph);
		const vertices_coords = [...graph.vertices_coords]
			.map(coords => coords.map(n => n * ratio));
		UIGraph.set({ ...graph, vertices_coords });
	}
		break;
	case "release": {
		const length = magnitude2(getSnapPoint(point).coords);
		const ratio = length / pressLength;
		if (isNaN(ratio) || !isFinite(ratio)) { break; }
		execute("scale", ratio);
		UIGraph.set({});
	}
		break;
	}
};
