import { get } from "svelte/store";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { execute } from "./app.js";
import { getSnapPoint } from "../js/nearest.js";
import { Selection } from "../stores/Select.js";
import {
	Current,
	Presses,
	Moves,
	Releases,
} from "../stores/UI.js";
import { Rulers } from "../stores/Ruler.js";

let pressVertex = undefined;

export const pointerEventAxiom1 = (eventType) => {
	// const { vertex } = nearest(get(Current));
	const { vertex } = getSnapPoint(get(Current));
	switch (eventType) {
	case "hover":
		Selection.reset();
		if (vertex !== undefined) { Selection.addVertices([vertex]); }
		break;
	case "press":
		Rulers.reset();
		Selection.reset();
		if (vertex !== undefined) { Selection.addVertices([vertex]); }
		pressVertex = vertex;
		break;
	case "move":
		Selection.reset();
		Selection.addVertices([pressVertex, vertex]
			.filter(a => a !== undefined));
		if (pressVertex !== undefined && vertex !== undefined) {
			execute("axiom1Preview", pressVertex, vertex);
		}
		break;
	case "release":
		if (pressVertex !== undefined && vertex !== undefined) {
			execute("axiom1", pressVertex, vertex);
		}
		pressVertex = undefined;
		Presses.set([]);
		Moves.set([]);
		Releases.set([]);
		break;
	}
};
