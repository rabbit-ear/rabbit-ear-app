import { get } from "svelte/store";
import execute from "../../kernel/execute.js";
import executeUI from "../../kernel/executeUI.js";
import {
	UIGraph,
	UILines,
} from "../../stores/UI.js";
import {
	snapToPoint,
	snapToRulerLine,
} from "../../js/snap.js";
import {
	Presses,
	Releases,
	ToolStep,
} from "./stores.js";

let pressCoords;

const pointerEventAxiom1 = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "release": Releases.update(p => [...p, point]); break;
	default: break;
	}
	switch (get(ToolStep)) {
	case 0: {
		const coords = snapToPoint(point, false);
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
		execute("axiom1Preview", pressCoords, coords);
	}
		break;
	case 2: {
		// "release" axiom operation done. ruler lines now drawn.
		// "hover" preview first edge point
		const coords = snapToPoint(point, false);
		UILines.set([]);
		if (eventType === "release") {
			execute("axiom1", pressCoords, coords);
			pressCoords = undefined;
		}
		// nearest point on line
		UIGraph.set({ vertices_coords: [snapToRulerLine(point).coords] });
	}
		break;
	case 3: {
		// "press" selecting first edge point
		// "move" preview second edge point
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
		executeUI("resetUI");
		break;
	}
};

export default pointerEventAxiom1;
