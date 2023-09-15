import { get } from "svelte/store";
import { executeCommand } from "../../kernel/execute.js";
import { Highlight } from "../../stores/Select.js";
import { RulerLines } from "../../stores/Ruler.js";
import {
	UIGraph,
	UILines,
} from "../../stores/UI.js";
import {
	snapToPoint,
	snapToEdge,
	snapToRulerLine,
} from "../../js/snap.js";
import {
	Presses,
	Releases,
	ToolStep,
} from "./stores.js";

let axiom5Edge;
let axiom5Point1;
let segmentPoint1;

const pointerEventAxiom5 = (eventType, { point }) => {
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
		executeCommand("axiom5Preview", axiom5Edge, axiom5Point1, axiom5Point2);
	}
		break;
	case 3: {
		const axiom5Point2 = snapToPoint(point, false);
		if (axiom5Edge !== undefined) { Highlight.addEdges([axiom5Edge]); }
		UIGraph.set({});
		UILines.set([]);
		executeCommand("axiom5Rulers", axiom5Edge, axiom5Point1, axiom5Point2);
	}
		break;
	case 4:
		UIGraph.set({ vertices_coords: [snapToRulerLine(point).coords] });
		break;
	case 5:
		const segmentPoint2 = snapToRulerLine(point).coords;
		if (eventType === "press") { segmentPoint1 = segmentPoint2; }
		UIGraph.set({
			vertices_coords: [segmentPoint1, segmentPoint2],
			edges_vertices: [[0, 1]],
		});
		break;
	default:
		executeCommand("segment",
			executeCommand("addVertex", segmentPoint1),
			executeCommand("addVertex", snapToRulerLine(point).coords),
		);
		UIGraph.set({});
		RulerLines.set([]);
		Presses.set([]);
		Releases.set([]);
		break;
	}
};

export default pointerEventAxiom5;
