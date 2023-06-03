import { get } from "svelte/store";
import {
	graph,
	metadata,
} from "../stores/graph.js";
import { current } from "../stores/ui.js";

const distance2 = (a, b) => {
	const x = a[0] - b[0];
	const y = a[1] - b[1];
	return Math.sqrt(x ** 2 + y ** 2);
};

export const handleToolVertex = (eventType) => {
	switch (eventType) {
	case "press":
		const distances = get(graph).vertices_coords
			.map(p => distance2(p, get(current)));
		const near = distances
			.map((d, i) => d < 0.3 ? i : undefined)
			.filter(a => a !== undefined)
			.sort((a, b) => distances[a] - distances[b])
			.shift();
		if (near !== undefined) {
			metadata.set({ ...get(metadata), newestVertex: near });
			break;
		}
		// add vertex
		const newestVertex = get(graph).vertices_coords.length;
		metadata.set({ ...get(metadata), newestVertex });
		get(graph).vertices_coords.push(get(current));
		graph.set({ ...get(graph) });
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
