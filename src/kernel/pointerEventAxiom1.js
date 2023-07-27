import { get } from "svelte/store";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { execute } from "./app.js";
import { snapToPoint, snapToVertex } from "../js/snap.js";
import { Highlight } from "../stores/Select.js";
import {
	Presses,
	Releases,
} from "../stores/UI.js";
import { RulerLines, RulerLinePreviews } from "../stores/Ruler.js";
import { RulersAutoClear } from "../stores/App.js";
import { ToolStep } from "../stores/Tool.js";
import { UIGraph } from "../stores/Graph.js";

let pressVertex = undefined;
let pressCoords;

export const pointerEventAxiom1 = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "release": Releases.update(p => [...p, point]); break;
	default: break;
	}
	// const { vertex } = getSnapPoint(point);
	const { vertex, coords } = snapToVertex(point, false);
	Highlight.reset();
	switch (get(ToolStep)) {
	case 0:
		if (vertex !== undefined) { Highlight.addVertices([vertex]); }
		break;
	case 1:
		// "press" selecting the first vertex
		// "move" preview the second vertex
		if (eventType === "press") { pressVertex = vertex; }
		if (vertex !== undefined) { Highlight.addVertices([vertex]); }
		if (pressVertex !== undefined) { Highlight.addVertices([pressVertex]); }
		execute("axiom1Preview", pressVertex, vertex);
		break;
	case 2:
		// "release" axiom operation done. ruler lines now drawn.
		// "hover" preview first edge point
		RulerLinePreviews.set([]);
		if (eventType === "release") {
			execute("axiom1", pressVertex, vertex);
			pressVertex = undefined;
		}
		// nearest point on line
		UIGraph.set({ vertices_coords: [snapToPoint(point, false)] });
		break;
	case 3:
		// "press" selecting first edge point
		// "move" preview second edge point
		const coords = snapToPoint(point, false);
		if (eventType === "press") {
			pressCoords = coords;
		}
		UIGraph.set({
			vertices_coords: [pressCoords, coords],
			edges_vertices: [[0, 1]],
		});
		break;
	default:
		// "release" drawing edge, reset all
		execute("addEdge",
			execute("addVertex", pressCoords),
			execute("addVertex", snapToPoint(point, false)),
		);
		// if (get(RulersAutoClear)) { RulerLines.set([]); }
		UIGraph.set({});
		RulerLines.set([]);
		Presses.set([]);
		Releases.set([]);
		break;
	}
};
