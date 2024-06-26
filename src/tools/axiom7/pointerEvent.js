import { get } from "svelte/store";
import { executeCommand } from "../../kernel/execute.js";
import {
	Move,
	Presses,
	Releases,
	InputEdge0,
	InputEdge1,
	InputPoint,
	Segment0,
	Segment1,
	Step,
	reset,
} from "./stores.js";

const pointerEvent = (eventType, { point }) => {
	Move.set(eventType === "move" ? point : undefined);
	switch (eventType) {
		case "move":
			break;
		case "press":
			Presses.update((p) => [...p, point]);
			break;
		case "release":
			Releases.update((p) => [...p, point]);
			switch (get(Step)) {
				case 4:
					executeCommand(
						"axiom7Rulers",
						get(InputEdge0),
						get(InputEdge1),
						get(InputPoint),
					);
					break;
				case 6:
					executeCommand("segment", [get(Segment0), get(Segment1)]);
					reset();
					break;
			}
	}
};

export default pointerEvent;

// import { get } from "svelte/store";
// import { executeCommand } from "../../kernel/execute.js";
// import { Highlight } from "../../stores/Select.js";
// import { RulersCP } from "../../stores/Ruler.js";
// import {
// 	GhostGraphCP,
// 	GuideLinesCP,
// } from "../../stores/UI.js";
// import {
// 	snapOldToPoint,
// 	snapToEdge,
// 	snapOldToRulerLine,
// } from "../../js/snapOld.js";
// import {
// 	Presses,
// 	Releases,
// 	ToolStep,
// } from "./stores.js";

// let releaseEdge;
// let pressCoords;

// const pointerEventAxiom7 = (eventType, { point }) => {
// 	switch (eventType) {
// 	case "press": Presses.update(p => [...p, point]); break;
// 	case "release": Releases.update(p => [...p, point]); break;
// 	default: break;
// 	}
// 	Highlight.reset();
// 	switch (get(ToolStep)) {
// 	case 0: {
// 		const coords = snapOldToPoint(point, false);
// 		if (coords !== undefined) { GhostGraphCP.set({ vertices_coords: [coords] }); }
// 	}
// 		break;
// 	case 1: {
// 		const { edge } = snapToEdge(point, false);
// 		if (eventType === "press") { pressCoords = snapOldToPoint(point, false); }
// 		GhostGraphCP.set({ vertices_coords: [pressCoords] });
// 		if (edge !== undefined) { Highlight.addEdges([edge]); }
// 	}
// 		break;
// 	case 2: {
// 		const { edge } = snapToEdge(point, false);
// 		// if (edge !== undefined) { Highlight.addEdges([edge]); }
// 		if (eventType === "release") { releaseEdge = edge; }
// 		if (releaseEdge !== undefined) { Highlight.addEdges([releaseEdge]); }
// 		if (edge !== undefined) { Highlight.addEdges([edge]); }
// 		GhostGraphCP.set({ vertices_coords: [pressCoords] });
// 		executeCommand("axiom7Preview", releaseEdge, edge, pressCoords);
// 		// nearest point on line
// 	}
// 		break;
// 	case 3: {
// 		const { edge } = snapToEdge(point, false);
// 		if (releaseEdge !== undefined) { Highlight.addEdges([releaseEdge]); }
// 		if (edge !== undefined) { Highlight.addEdges([edge]); }
// 		GhostGraphCP.set({});
// 		GuideLinesCP.set([]);
// 		executeCommand("axiom7Rulers", releaseEdge, edge, pressCoords);
// 	}
// 		break;
// 	case 4:
// 		GhostGraphCP.set({ vertices_coords: [snapOldToRulerLine(point).coords] });
// 		break;
// 	case 5: {
// 		const { coords } = snapOldToRulerLine(point);
// 		if (eventType === "press") { pressCoords = coords; }
// 		GhostGraphCP.set({
// 			vertices_coords: [pressCoords, coords],
// 			edges_vertices: [[0, 1]],
// 		});
// 	}
// 		break;
// 	default:
// 		// "release" drawing edge, reset all
// 		executeCommand("segment", [
// 			executeCommand("vertex", pressCoords),
// 			executeCommand("vertex", snapOldToRulerLine(point).coords),
// 		]);
// 		RulersCP.set([]);
// 		GhostGraphCP.set({});
// 		RulersCP.set([]);
// 		Presses.set([]);
// 		Releases.set([]);
// 		break;
// 	}
// };

// export default pointerEventAxiom7
