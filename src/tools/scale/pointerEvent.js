import {
	magnitude2,
	distance2,
	subtract2,
} from "rabbit-ear/math/vector.js";
import { get } from "svelte/store";
import { Graph } from "../../stores/Model.js";
import { UIGraph } from "../../stores/UI.js";
import { executeCommand } from "../../kernel/execute.js";

let pressLength = 1;
let ratio = 1;

const getSnapPointLength = (point) => (
	// magnitude2(getSnapPoint(point).coords)
	magnitude2(point)
);

const pointerEventScale = (eventType, { point }) => {
	switch (eventType) {
	case "press":
		pressLength = getSnapPointLength(point);
		break;
	case "move":
		ratio = getSnapPointLength(point) / pressLength;
		if (isNaN(ratio) || !isFinite(ratio)) { break; }
		const graph = get(Graph);
		const vertices_coords = [...graph.vertices_coords]
			.map(coords => coords.map(n => n * ratio));
		UIGraph.set({ ...graph, vertices_coords });
		break;
	case "release":
		ratio = getSnapPointLength(point) / pressLength;
		if (isNaN(ratio) || !isFinite(ratio)) { break; }
		executeCommand("scale", ratio);
		UIGraph.set({});
		break;
	}
};

// const nonUniform = () => {
// 	const ratio = [
// 		releaseCoords[0] / pressCoords[0],
// 		releaseCoords[1] / pressCoords[1],
// 	];
// 	const vector = (Number.isFinite(ratio[0]) && Number.isFinite(ratio[1])
// 		? ratio
// 		: [1, 1]);
// 	const vertices_coords = [...graph.vertices_coords]
// 		.map(coords => coords.map((n, i) => n * vector[i]));
// };

export default pointerEventScale;
