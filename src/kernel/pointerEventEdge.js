import {
	distance2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import { graph } from "../stores/graph.js";
import { viewBox } from "../stores/app.js";
import { selected } from "../stores/select.js";
import {
	current,
	presses,
	moves,
	releases,
} from "../stores/ui.js";
import { didTouchVertex } from "../js/nearest.js";
import { execute } from "./app.js";

export const pointerEventEdge = (eventType) => {
	switch (eventType) {
	case "press":
		const near = didTouchVertex(get(current));
		if (near !== undefined) {
			const vertices = [];
			vertices[near] = true;
			selected.set({ ...get(selected), vertices });
		} else {
			execute("addVertex", get(current));
		}
		const vertex = execute("addVertex", get(current));
		execute("addEdge", near !== undefined ? near : vertex - 1, vertex);
		break;
	case "move":
		const origin = get(moves).length > 2
			? get(moves)[get(moves).length - 2]
			: get(presses)[get(presses).length - 1];
		// const origin = get(presses)[get(presses).length - 1];
		const end = get(current);
		const vector = subtract2(end, origin);
		// move currently selected vertices
		const newVertex = get(graph).vertices_coords.length - 1;
		execute("translateVertices", [newVertex], vector);
		break;
	case "release":
		presses.set([]);
		moves.set([]);
		releases.set([]);
		break;
	}
};
