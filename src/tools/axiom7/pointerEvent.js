import { get } from "svelte/store";
import execute from "../../kernel/execute.js";
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

let releaseEdge;
let pressCoords;

const pointerEventAxiom7 = (eventType, { point }) => {
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
		const { edge } = snapToEdge(point, false);
		// if (edge !== undefined) { Highlight.addEdges([edge]); }
		if (eventType === "release") { releaseEdge = edge; }
		if (releaseEdge !== undefined) { Highlight.addEdges([releaseEdge]); }
		if (edge !== undefined) { Highlight.addEdges([edge]); }
		UIGraph.set({ vertices_coords: [pressCoords] });
		execute("axiom7Preview", releaseEdge, edge, pressCoords);
		// nearest point on line
	}
		break;
	case 3: {
		const { edge } = snapToEdge(point, false);
		if (releaseEdge !== undefined) { Highlight.addEdges([releaseEdge]); }
		if (edge !== undefined) { Highlight.addEdges([edge]); }
		UIGraph.set({});
		UILines.set([]);
		execute("axiom7", releaseEdge, edge, pressCoords);
	}
		break;
	case 4:
		UIGraph.set({ vertices_coords: [snapToRulerLine(point).coords] });
		break;
	case 5: {
		const { coords } = snapToRulerLine(point);
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
			execute("addVertex", snapToRulerLine(point).coords),
		);
		// if (get(RulersAutoClear)) { RulerLines.set([]); }
		UIGraph.set({});
		RulerLines.set([]);
		Presses.set([]);
		Releases.set([]);
		break;
	}
};

export default pointerEventAxiom7
