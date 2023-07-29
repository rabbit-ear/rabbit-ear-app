import { UIGraph } from "../stores/Graph.js";
import { snapToPoint } from "../js/snap.js";
import { execute } from "./app.js";

let pressCoords = undefined;

export const pointerEventEdge = (eventType, { point }) => {
	const coords = snapToPoint(point, false);
	switch (eventType) {
	case "hover":
		UIGraph.set({ vertices_coords: [coords] });
	break;
	case "press":
		pressCoords = coords;
		UIGraph.set({ vertices_coords: [coords] });
	break;
	case "move":
		UIGraph.set({
			vertices_coords: [pressCoords, coords],
			edges_vertices: [[0, 1]],
		});
	break;
	case "release":
		execute("addEdge",
			execute("addVertex", pressCoords),
			execute("addVertex", coords),
		);
		UIGraph.set({ vertices_coords: [coords] });
	break;
	}
};
