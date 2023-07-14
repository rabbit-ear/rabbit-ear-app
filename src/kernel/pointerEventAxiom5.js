import { axiom2 } from "rabbit-ear/axioms/axiomsVecLine.js";
import { get } from "svelte/store";
import { Selection } from "../stores/Select.js";
import {
	Current,
	Presses,
	Moves,
	Releases,
} from "../stores/UI.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";
import { Rulers } from "../stores/Ruler.js";
import { ToolStep } from "../stores/Tool.js";

let pressCoords = undefined;
let pressVertex = undefined;

let releaseCoords = undefined;
let releaseVertex = undefined;

export const pointerEventAxiom5 = (eventType) => {
	const { coords, vertex } = getSnapPoint(get(Current));
	switch (eventType) {
	case "hover":
		Selection.reset();
		if (vertex !== undefined) {
			Selection.addVertices([vertex]);
		}
		break;
	case "press": {
		pressVertex = vertex;
		pressCoords = coords;
		releaseCoords = [...coords];
		const result = axiom2(pressCoords, releaseCoords);
		if (result) {
			Rulers.set(result);
		}
		Selection.reset();
		if (vertex !== undefined) {
			Selection.addVertices([vertex]);
		}
	}
		break;
	case "move": {
		releaseVertex = vertex;
		releaseCoords = coords;
		const result = axiom2(pressCoords, releaseCoords);
		if (result) {
			Rulers.set(result);
		}
		Selection.reset();
		Selection.addVertices([pressVertex, releaseVertex]
			.filter(a => a !== undefined));
	}
		break;
	case "release":
		releaseCoords = coords;
		const result = axiom2(pressCoords, releaseCoords);
		if (result) {
			Rulers.set(result);
		}
		Presses.set([]);
		Moves.set([]);
		Releases.set([]);
		break;
	}
};
