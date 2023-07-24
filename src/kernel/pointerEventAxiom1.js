import { get } from "svelte/store";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { execute } from "./app.js";
import { getSnapPoint } from "../js/nearest.js";
import { Selection } from "../stores/Select.js";
import {
	Presses,
	Releases,
} from "../stores/UI.js";
import { Rulers, RulerPreviews } from "../stores/Ruler.js";
import { RulersAutoClear } from "../stores/App.js";

let pressVertex = undefined;

export const pointerEventAxiom1 = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "hover": break;
	case "move": break;
	case "release": Releases.update(p => [...p, point]); break;
	}
	const { vertex } = getSnapPoint(point);
	switch (eventType) {
	case "hover":
		Selection.reset();
		if (vertex !== undefined) { Selection.addVertices([vertex]); }
		break;
	case "press":
		pressVertex = vertex;
		// if (get(RulersAutoClear)) { Rulers.set([]); }
		// no break
	case "move":
		Selection.reset();
		Selection.addVertices([pressVertex, vertex]
			.filter(a => a !== undefined));
		execute("axiom1Preview", pressVertex, vertex);
		break;
	case "release":
		execute("axiom1", pressVertex, vertex);
		pressVertex = undefined;
		RulerPreviews.set([]);
		Rulers.set([]);
		Presses.set([]);
		Releases.set([]);
		break;
	}
};
