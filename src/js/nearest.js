import { get } from "svelte/store";
import { distance2 } from "rabbit-ear/math/algebra/vector.js";
import { graph } from "../stores/graph.js";
import { viewBox } from "../stores/app.js";

export const didTouchVertex = (point) => {
	const vb = get(viewBox);
	const vmax = Math.max(vb[2], vb[3]);
	const touchEpsilon = vmax * 0.05;
	const distances = get(graph).vertices_coords
		.map(p => distance2(p, point));
	return distances
		.map((d, i) => d < touchEpsilon ? i : undefined)
		.filter(a => a !== undefined)
		.sort((a, b) => distances[a] - distances[b])
		.shift();
};
