import { get } from "svelte/store";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { execute } from "./app.js";
import { snapToPoint, snapToEdge } from "../js/snap.js";
import { Highlight } from "../stores/Select.js";
import { Presses, Releases } from "../stores/UI.js";
import { RulerLines, RulerLinePreviews } from "../stores/Ruler.js";
import { ToolStep } from "../stores/Tool.js";
import { UIGraph } from "../stores/Graph.js";

let releaseEdge;
let pressCoords;

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
		if (eventType === "press") { pressCoords = snapToPoint(point, false); }
		UIGraph.set({ vertices_coords: [pressCoords] });
		if (edge !== undefined) { Highlight.addEdges([edge]); }
	}
		break;
	case 2: {
		const coords = snapToPoint(point, false);
		const { edge } = snapToEdge(point, false);
		// if (edge !== undefined) { Highlight.addEdges([edge]); }
		if (eventType === "release") { releaseEdge = edge; }
		if (releaseEdge !== undefined) { Highlight.addEdges([releaseEdge]); }
		UIGraph.set({ vertices_coords: [pressCoords, coords] });
		execute("axiom5Preview", releaseEdge, pressCoords, coords);
		// nearest point on line
	}
		break;
	case 3: {
		const coords = snapToPoint(point, false);
		if (releaseEdge !== undefined) { Highlight.addEdges([releaseEdge]); }
		UIGraph.set({});
		RulerLinePreviews.set([]);
		execute("axiom5", releaseEdge, pressCoords, coords);
	}
		break;
	case 4:
		UIGraph.set({ vertices_coords: [snapToPoint(point, false)] });
		break;
	case 5: {
		const coords = snapToPoint(point, false);
		if (eventType === "press") { pressCoords = coords; }
		UIGraph.set({
			vertices_coords: [pressCoords, coords],
			edges_vertices: [[0, 1]],
		});
	}
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
