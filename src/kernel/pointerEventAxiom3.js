import { get } from "svelte/store";
import { Highlight } from "../stores/Select.js";
import { Presses, Releases } from "../stores/UI.js";
import {
	snapToPoint,
	snapToEdge,
} from "../js/snap.js";
import { execute } from "./app.js";
import { RulerLines, RulerLinePreviews } from "../stores/Ruler.js";
import { UIGraph } from "../stores/Graph.js";
// import { RulersAutoClear } from "../stores/App.js";
import { ToolStep } from "../stores/Tool.js";

let pressEdge = undefined;
let pressCoords = undefined;

export const pointerEventAxiom3 = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "release": Releases.update(p => [...p, point]); break;
	default: break;
	}
	const { edge, coords } = snapToEdge(point);
	Highlight.reset();
	switch (get(ToolStep)) {
	case 0:
		if (edge !== undefined) { Highlight.addEdges([edge]); }
		break;
	case 1:
		// "press" selecting the first edge
		// "move" preview the second edge
		if (eventType === "press") { pressEdge = edge; }
		if (edge !== undefined) { Highlight.addEdges([edge]); }
		if (pressEdge !== undefined) { Highlight.addEdges([pressEdge]); }
		execute("axiom3Preview", pressEdge, edge);
		break;
	case 2:
		// "release" axiom operation done. ruler lines now drawn.
		// "hover" preview first edge point
		RulerLinePreviews.set([]);
		if (eventType === "release") {
			// inputs are bad. reset to step 0
			if (pressEdge === undefined || edge === undefined) {
				Presses.set([]);
				Releases.set([]);
				break;
			}
			execute("axiom3", pressEdge, edge);
			pressEdge = undefined;
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
