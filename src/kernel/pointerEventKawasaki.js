import { nearest } from "rabbit-ear/graph/nearest.js";
import { get } from "svelte/store";
import {
	snapToVertex,
	snapToPoint,
} from "../js/snap.js";
import { Highlight } from "../stores/Select.js";
import { Graph, UIGraph } from "../stores/Graph.js";
import { ToolStep } from "../stores/Tool.js";
import { Presses, Releases } from "../stores/UI.js";
import { RulerRays, RulerRayPreviews } from "../stores/Ruler.js";
import { execute } from "./app.js";

let pressVertex;
let pressCoords;

export const pointerEventKawasaki = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "hover": break;
	case "move": break;
	case "release": Releases.update(p => [...p, point]); break;
	}
	switch (get(ToolStep)) {
	case 0: {
		Highlight.reset();
		const { vertex, coords } = snapToVertex(point, true);
		if (vertex !== undefined) {
			Highlight.addVertices([vertex]);
			execute("kawasakiRulerPreviews", vertex);
		}
	}
		break;
	case 1:
		if (eventType === "press") {
			const { vertex, coords } = snapToVertex(point, true);
			pressVertex = vertex;
			pressCoords = coords;
			RulerRayPreviews.set([]);
			execute("kawasakiRulers", vertex);
		} else {
			const coords = snapToPoint(point, false);
			UIGraph.set({
				vertices_coords: [pressCoords, coords],
				edges_vertices: [[0, 1]],
			});
		}
		break;
	default:
		// release
		execute("addEdge",
			execute("addVertex", pressCoords),
			execute("addVertex", snapToPoint(point, false)),
		);
		UIGraph.set({});
		RulerRays.set([]);
		Presses.set([]);
		Releases.set([]);
		break;
	}
};
