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

let pressEdge;
let pressCoords;
/**
 * @description Axiom 4 pointer event
 */
const pointerEvent = (eventType, { point }) => {
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
			execute("axiom4Rulers", pressEdge, coords);
			pressEdge = undefined;
		}
		// nearest point on line
		UIGraph.set({ vertices_coords: [snapToRulerLine(point).coords] });
	}
		break;
	case 3: {
		const { coords } = snapToRulerLine(point);
		if (eventType === "press") { pressCoords = coords; }
		UIGraph.set({
			vertices_coords: [pressCoords, coords],
			edges_vertices: [[0, 1]],
		});
	}
		break;
	default:
		execute("segment",
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

export default pointerEvent;
