import { get } from "svelte/store";
import { execute } from "./app.js";
import { snapToPoint, snapToEdge } from "../js/snap.js";
import { Highlight } from "../stores/Select.js";
import { RulerLines } from "../stores/Ruler.js";
import { ToolStep } from "../stores/Tool.js";
import {
	Presses,
	Releases,
	UIGraph,
	UILines,
} from "../stores/UI.js";

let pressEdge;
let pressCoords;

export const pointerEventAxiom4 = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "release": Releases.update(p => [...p, point]); break;
	default: break;
	}
	Highlight.reset();
	switch (get(ToolStep)) {
	case 0: {
		const { edge } = snapToEdge(point, false);
		if (edge !== undefined) { Highlight.addEdges([edge]); }
	}
		break;
	case 1: {
		const { edge } = snapToEdge(point, false);
		const coords = snapToPoint(point, false);
		if (eventType === "press") { pressEdge = edge; }
		if (coords !== undefined) { UIGraph.set({ vertices_coords: [coords] }); }
		if (pressEdge !== undefined) {
			Highlight.addEdges([pressEdge]);
			execute("axiom4Preview", pressEdge, coords);
		}
	}
		break;
	case 2: {
		const coords = snapToPoint(point, false);
		UILines.set([]);
		if (eventType === "release") {
			execute("axiom4", pressEdge, coords);
			pressEdge = undefined;
		}
		// nearest point on line
		UIGraph.set({ vertices_coords: [snapToPoint(point, false)] });
	}
		break;
	case 3: {
		const coords = snapToPoint(point, false);
		if (eventType === "press") { pressCoords = coords; }
		UIGraph.set({
			vertices_coords: [pressCoords, coords],
			edges_vertices: [[0, 1]],
		});
	}
		break;
	default:
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
