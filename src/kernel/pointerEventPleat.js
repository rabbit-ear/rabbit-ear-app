import { nearest } from "rabbit-ear/graph/nearest.js";
import { get } from "svelte/store";
import {
	snapToPoint,
	snapToEdge,
} from "../js/snap.js";
import { Highlight } from "../stores/Select.js";
import { Graph } from "../stores/Graph.js";
import { RulerLines, RulerLinePreviews } from "../stores/Ruler.js";
import { execute } from "./app.js";
import {
	ToolStep,
	PleatCount,
} from "../stores/Tool.js";
import {
	Presses,
	Releases,
} from "../stores/UI.js";

let pressEdge;

export const pointerEventPleat = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "hover": break;
	case "move": break;
	case "release": Releases.update(p => [...p, point]); break;
	}
	const { edge, coords } = snapToEdge(point);
	Highlight.reset();
	switch (get(ToolStep)) {
	case 0:
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
		RulerLinePreviews.set([]);
		execute("pleatPreview", pressEdge, edge, get(PleatCount));
		break;
	case 2:
		// "release" axiom operation done
		// "hover" preview first edge point
		// RulerPreviews.set([]);
		if (eventType === "release") {
			RulerLinePreviews.set([]);
			execute("pleat", pressEdge, edge, get(PleatCount));
			pressEdge = undefined;
		}
		if (vertex !== undefined) { Highlight.addVertices([vertex]); }
		// if (get(RulersAutoClear)) { Rulers.set([]); }
		Presses.set([]);
		Releases.set([]);
		break;
	default: break;
	}
};