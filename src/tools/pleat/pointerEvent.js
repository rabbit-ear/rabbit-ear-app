import { nearest } from "rabbit-ear/graph/nearest.js";
import { get } from "svelte/store";
import {
	snapToEdge,
	snapOldToRulerLine,
} from "../../js/snap.js";
import { RulersCP } from "../../stores/Ruler.js";
import { executeCommand } from "../../kernel/execute.js";
import {
	Presses,
	Releases,
	ToolStep,
	PleatCount,
} from "./stores.js";
import {
	GuideLinesCP,
	Highlight,
} from "../../stores/UI.js";

let pressEdge;
let selectedRulerLines = {};

// note: GuideLinesCP this doesn't work anymore.
// the setters don't work for what the variable is expecting

const pointerEventPleat = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "release": Releases.update(p => [...p, point]); break;
	default: break;
	}
	const { edge, coords } = snapToEdge(point);
	Highlight.reset();
	switch (get(ToolStep)) {
	case 0:
		selectedRulerLines = {};
		if (edge !== undefined) { Highlight.addEdges([edge]); }
		break;
	case 1:
		// "press" selecting the first edge
		// "move" preview the second edge
		if (eventType === "press") {
			RulersCP.set([]);
			pressEdge = edge;
		}
		if (edge !== undefined) { Highlight.addEdges([edge]); }
		if (pressEdge !== undefined) { Highlight.addEdges([pressEdge]); }
		GuideLinesCP.set([]);
		executeCommand("pleatPreview", pressEdge, edge, get(PleatCount));
		break;
	case 2: {
		selectedRulerLines = {};
		// "release" axiom operation done
		// "hover" preview first edge point
		// RulerPreviews.set([]);
		if (eventType === "release") {
			GuideLinesCP.set([]);
			executeCommand("pleat", pressEdge, edge, get(PleatCount));
			pressEdge = undefined;
		}
		if (vertex !== undefined) { Highlight.addVertices([vertex]); }
		const { index } = snapOldToRulerLine(point, false);
		if (index !== undefined) {
			// console.log("SEetting", get(RulersCP)[index]);
			GuideLinesCP.set([get(RulersCP)[index]]);
		}
		RulersCP.set([]);
	}
		break;
	case 3: {
		const { index } = snapOldToRulerLine(point, false);
		if (index !== undefined) {
			selectedRulerLines[index] = true;
		}
		const rulerLines = get(RulersCP);
		GuideLinesCP.set(Object.keys(selectedRulerLines)
			.map(i => rulerLines[i]));
	}
		break;
	case 4: {
		const rulerLines = get(RulersCP);
		const lines = Object.keys(selectedRulerLines).map(i => rulerLines[i]);
		// todo "addLines" instead of one at a time.
		lines.forEach(line => executeCommand("line", line));
		// console.log("lines", lines);
		RulersCP.set([]);
		GuideLinesCP.set([]);
		Presses.set([]);
		Releases.set([]);
	}
		break;
	default: break;
	}
};
export default pointerEventPleat;
