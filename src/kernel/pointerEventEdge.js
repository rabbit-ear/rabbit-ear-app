import { UIGraph } from "../stores/Graph.js";
import { snapToPoint } from "../js/snap.js";
import { execute } from "./app.js";

let pressCoords = undefined;
let releaseCoords = undefined;

export const pointerEventEdge = (eventType, { point }) => {
	const coords = snapToPoint(point, false);
	switch (eventType) {
	case "press": {
		pressCoords = coords;
		releaseCoords = [...coords];
		UIGraph.set({
			vertices_coords: [pressCoords, releaseCoords],
			edges_vertices: [[0, 1]],
		});
	}
		break;
	case "move": {
		releaseCoords = coords;
		UIGraph.set({
			vertices_coords: [pressCoords, releaseCoords],
			edges_vertices: [[0, 1]],
		});
	}
		break;
	case "release":
		releaseCoords = coords;
		execute("addEdge",
			execute("addVertex", pressCoords),
			execute("addVertex", releaseCoords),
		);
		UIGraph.set({});
		break;
	}
};
