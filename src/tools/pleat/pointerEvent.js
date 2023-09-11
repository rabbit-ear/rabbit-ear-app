import { nearest } from "rabbit-ear/graph/nearest.js";
import { get } from "svelte/store";
import {
	snapToPoint,
	snapToEdge,
	snapToRulerLine,
} from "../../js/snap.js";
import { Highlight } from "../../stores/Select.js";
import { RulerLines } from "../../stores/Ruler.js";
import execute from "../../kernel/execute.js";
import executeUI from "../../kernel/executeUI.js";
import {
	Presses,
	Releases,
	ToolStep,
	PleatCount,
} from "./stores.js";
import {
	UILines,
} from "../../stores/UI.js";

let pressEdge;
let selectedRulerLines = {};

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
			RulerLines.set([]);
			pressEdge = edge;
		}
		// if (get(RulersAutoClear)) { Rulers.set([]); }
		if (edge !== undefined) { Highlight.addEdges([edge]); }
		if (pressEdge !== undefined) { Highlight.addEdges([pressEdge]); }
		UILines.set([]);
		executeUI("pleatPreview", pressEdge, edge, get(PleatCount));
		break;
	case 2: {
		selectedRulerLines = {};
		// "release" axiom operation done
		// "hover" preview first edge point
		// RulerPreviews.set([]);
		if (eventType === "release") {
			UILines.set([]);
			execute("pleat", pressEdge, edge, get(PleatCount));
			pressEdge = undefined;
		}
		if (vertex !== undefined) { Highlight.addVertices([vertex]); }
		const { index } = snapToRulerLine(point, false);
		if (index !== undefined) {
			// console.log("SEetting", get(RulerLines)[index]);
			UILines.set([get(RulerLines)[index]]);
		}
		// if (get(RulersAutoClear)) { Rulers.set([]); }
	}
		break;
	case 3: {
		const { index } = snapToRulerLine(point, false);
		if (index !== undefined) {
			selectedRulerLines[index] = true;
		}
		const rulerLines = get(RulerLines);
		UILines.set(Object.keys(selectedRulerLines)
			.map(i => rulerLines[i]));
	}
		break;
	case 4: {
		const rulerLines = get(RulerLines);
		const lines = Object.keys(selectedRulerLines).map(i => rulerLines[i]);
		// todo "addLines" instead of one at a time.
		lines.forEach(line => execute("addLine", line));
		// console.log("lines", lines);
		RulerLines.set([]);
		UILines.set([]);
		Presses.set([]);
		Releases.set([]);
	}
		break;
	default: break;
	}
};
export default pointerEventPleat;
