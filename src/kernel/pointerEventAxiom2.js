import { axiom2 } from "rabbit-ear/axioms/axiomsVecLine.js";
import { get } from "svelte/store";
import { Highlight } from "../stores/Select.js";
import {
	Presses,
	Releases,
} from "../stores/UI.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";
import { RulerLines, RulerLinePreviews } from "../stores/Ruler.js";
import { ToolStep } from "../stores/Tool.js";
import { RulersAutoClear } from "../stores/App.js";

let pressVertex = undefined;

export const pointerEventAxiom2 = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "hover": break;
	case "move": break;
	case "release": Releases.update(p => [...p, point]); break;
	}
	const { vertex } = getSnapPoint(point);
	switch (eventType) {
	case "hover":
		Highlight.reset();
		if (vertex !== undefined) { Highlight.addVertices([vertex]); }
		break;
	case "press":
		pressVertex = vertex;
		if (get(RulersAutoClear)) { RulerLines.set([]); }
		// no break
	case "move":
		Highlight.reset();
		Highlight.addVertices([pressVertex, vertex]
			.filter(a => a !== undefined));
		execute("axiom2Preview", pressVertex, vertex);
		break;
	case "release":
		execute("axiom2", pressVertex, vertex);
		pressVertex = undefined;
		RulerLinePreviews.set([]);
		Presses.set([]);
		Releases.set([]);
		break;
	}
};
