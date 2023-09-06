import { get } from "svelte/store";
import execute from "../../kernel/execute.js";
import { Highlight } from "../../stores/Select.js";
import { RulerLines } from "../../stores/Ruler.js";
import { ToolStep } from "../../stores/Tool.js";
import {
	Presses,
	Releases,
	UIGraph,
	UILines,
} from "../../stores/UI.js";
import {
	snapToPoint,
	snapToRulerLine,
} from "../../js/snap.js";

let pressCoords;

const pointerEventAxiom2 = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "release": Releases.update(p => [...p, point]); break;
	default: break;
	}
	// const { vertex } = getSnapPoint(point);
	Highlight.reset();
	switch (get(ToolStep)) {
	case 0: {
		const coords = snapToPoint(point, false);
		// if (coords !== undefined) { Highlight.addVertices([vertex]); }
		if (coords !== undefined) { UIGraph.set({ vertices_coords: [coords] }); }
	}
		break;
	case 1: {
		// "press" selecting the first vertex
		// "move" preview the second vertex
		const coords = snapToPoint(point, false);
		if (eventType === "press") { pressCoords = coords; }
		if (coords !== undefined) { UIGraph.set({ vertices_coords: [coords] }); }
		if (pressCoords !== undefined) {
			UIGraph.set({ vertices_coords: [coords, pressCoords] });
		}
		execute("axiom2Preview", pressCoords, coords);
	}
		break;
	case 2: {
		// "release" axiom operation done. ruler lines now drawn.
		// "hover" preview first edge point
		const coords = snapToPoint(point, false);
		UILines.set([]);
		if (eventType === "release") {
			execute("axiom2", pressCoords, coords);
			pressCoords = undefined;
		}
		// nearest point on line
		UIGraph.set({ vertices_coords: [snapToRulerLine(point).coords] });
	}
		break;
	case 3: {
		const { coords } = snapToRulerLine(point);
		// "press" selecting first edge point
		// "move" preview second edge point
		if (eventType === "press") {
			pressCoords = coords;
		}
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

export default pointerEventAxiom2;
