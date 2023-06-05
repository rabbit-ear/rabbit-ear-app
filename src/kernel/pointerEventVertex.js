import {
	distance2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import { graph } from "../stores/graph.js";
import { viewBox } from "../stores/app.js";
import { selected } from "../stores/select.js";
import { current } from "../stores/ui.js";

const translateVertices = (vertices) => {
	const graphValue = get(graph);
	if (vertices.length < 2) {
		vertices.forEach(v => { graphValue.vertices_coords[v] = get(current); });
	} else {
		const origin = get(presses)[get(presses).length - 1];
		const end = get(current);
		const vector = subtract2(origin, end);
		console.log("move many", origin, end, vector);
		vertices.forEach(v => { graphValue.vertices_coords[v] = get(current); });
	}
	graph.simpleSet({ ...graphValue });
}

export const pointerEventVertex = (eventType) => {
	const vb = get(viewBox);
	const vmax = Math.max(vb[2], vb[3]);
	switch (eventType) {
	case "press":
		const distances = get(graph).vertices_coords
			.map(p => distance2(p, get(current)));
		const near = distances
			.map((d, i) => d < vmax * 0.05 ? i : undefined)
			.filter(a => a !== undefined)
			.sort((a, b) => distances[a] - distances[b])
			.shift();
		if (near !== undefined) {
			const vertices = [];
			vertices[near] = true;
			selected.set({ ...get(selected), vertices });
			break;
		}
		// add vertex
		const newestVertex = get(graph).vertices_coords.length;
		get(graph).vertices_coords.push(get(current));
		graph.set({ ...get(graph) });
		const vertices = [];
		vertices[newestVertex] = true;
		selected.set({ ...get(selected), vertices });
		break;
	case "move": {
		// get a flat list of all the selected vertices
		const selectedVertices = get(selected).vertices;
		const vertices = Object.keys(selectedVertices)
			.map(key => selectedVertices[key] ? key : undefined)
			.filter(a => a !== undefined);
		// move currently selected vertices
		translateVertices(vertices);
	}
		break;
	case "release":
		// selected.reset();
		break;
	}
};
