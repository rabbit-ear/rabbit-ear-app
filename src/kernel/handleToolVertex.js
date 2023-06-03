import { get } from "svelte/store";
import {
	graph,
	metadata,
} from "../stores/graph.js";
import { viewBox, selected } from "../stores/app.js";
import { current } from "../stores/ui.js";

const distance2 = (a, b) => {
	const x = a[0] - b[0];
	const y = a[1] - b[1];
	return Math.sqrt(x ** 2 + y ** 2);
};

export const handleToolVertex = (eventType) => {
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
			metadata.set({ ...get(metadata), newestVertex: near });
			const vertices = [];
			vertices[near] = true;
			selected.set({ ...get(selected), vertices });
			break;
		}
		// add vertex
		const newestVertex = get(graph).vertices_coords.length;
		metadata.set({ ...get(metadata), newestVertex });
		get(graph).vertices_coords.push(get(current));
		graph.set({ ...get(graph) });
		const vertices = [];
		vertices[newestVertex] = true;
		selected.set({ ...get(selected), vertices });
		break;
	case "move":
		if (!(get(metadata).newestVertex < get(graph).vertices_coords.length)) { break; }
		get(graph).vertices_coords[get(metadata).newestVertex] = get(current);
		graph.set({ ...get(graph) });
		// move most recently added vertex.
		break;
	case "release":
		break;
	}
};
