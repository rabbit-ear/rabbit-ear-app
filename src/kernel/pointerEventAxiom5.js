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

let axiom5Edge;
let axiom5Point1;
let segmentPoint1;

export const pointerEventAxiom5 = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "release": Releases.update(p => [...p, point]); break;
	default: break;
	}
	Highlight.reset();
	switch (get(ToolStep)) {
	case 0: {
		const coords = snapToPoint(point, false);
		if (coords !== undefined) { UIGraph.set({ vertices_coords: [coords] }); }
	}
		break;
	case 1: {
		const { edge } = snapToEdge(point, false);
		if (eventType === "press") { axiom5Point1 = snapToPoint(point, false); }
		UIGraph.set({ vertices_coords: [axiom5Point1] });
		if (edge !== undefined) { Highlight.addEdges([edge]); }
	}
		break;
	case 2: {
		const axiom5Point2 = snapToPoint(point, false);
		const { edge } = snapToEdge(point, false);
		if (eventType === "release") { axiom5Edge = edge; }
		if (axiom5Edge !== undefined) { Highlight.addEdges([axiom5Edge]); }
		UIGraph.set({ vertices_coords: [axiom5Point1, axiom5Point2] });
		execute("axiom5Preview", axiom5Edge, axiom5Point1, axiom5Point2);
	}
		break;
	case 3: {
		const axiom5Point2 = snapToPoint(point, false);
		if (axiom5Edge !== undefined) { Highlight.addEdges([axiom5Edge]); }
		UIGraph.set({});
		UILines.set([]);
		execute("axiom5", axiom5Edge, axiom5Point1, axiom5Point2);
	}
		break;
	case 4:
		UIGraph.set({ vertices_coords: [snapToPoint(point, false)] });
		break;
	case 5:
		const segmentPoint2 = snapToPoint(point, false);
		if (eventType === "press") { segmentPoint1 = segmentPoint2; }
		UIGraph.set({
			vertices_coords: [segmentPoint1, segmentPoint2],
			edges_vertices: [[0, 1]],
		});
		break;
	default:
		execute("addEdge",
			execute("addVertex", segmentPoint1),
			execute("addVertex", snapToPoint(point, false)),
		);
		UIGraph.set({});
		RulerLines.set([]);
		Presses.set([]);
		Releases.set([]);
		break;
	}
};
