import { get } from "svelte/store";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { execute } from "./app.js";
import { snapToPoint, snapToVertex } from "../js/snap.js";
import { Highlight } from "../stores/Select.js";
import { Presses, Releases } from "../stores/UI.js";
import { RulerLines, RulerLinePreviews } from "../stores/Ruler.js";
// import { RulersAutoClear } from "../stores/App.js";
import { ToolStep } from "../stores/Tool.js";
import { UIGraph } from "../stores/Graph.js";

let pressCoords;

export const pointerEventAxiom1 = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "release": Releases.update(p => [...p, point]); break;
	default: break;
	}
	const coords = snapToPoint(point, false);
	Highlight.reset();
	switch (get(ToolStep)) {
	case 0:
		if (coords !== undefined) { UIGraph.set({ vertices_coords: [coords] }); }
		break;
	case 1:
		// "press" selecting the first vertex
		// "move" preview the second vertex
		if (eventType === "press") { pressCoords = coords; }
		if (coords !== undefined) { UIGraph.set({ vertices_coords: [coords] }); }
		if (pressCoords !== undefined) {
			UIGraph.set({ vertices_coords: [coords, pressCoords] });
		}
		execute("axiom1Preview", pressCoords, coords);
		break;
	case 2:
		// "release" axiom operation done. ruler lines now drawn.
		// "hover" preview first edge point
		RulerLinePreviews.set([]);
		if (eventType === "release") {
			execute("axiom1", pressCoords, coords);
			pressCoords = undefined;
		}
		// nearest point on line
		UIGraph.set({ vertices_coords: [snapToPoint(point, false)] });
		break;
	case 3:
		// "press" selecting first edge point
		// "move" preview second edge point
		if (eventType === "press") { pressCoords = coords; }
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
