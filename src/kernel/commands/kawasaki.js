import { get } from "svelte/store";
import { clampRay } from "rabbit-ear/math/line.js";
import { includeR } from "rabbit-ear/math/compare.js";
import { kawasakiSolutions } from "rabbit-ear/singleVertex/kawasaki.js";
import { CreasePattern } from "../../stores/Model.js";
import { RulersCP } from "../../stores/Ruler.js";
import { GuideLinesCP } from "../../stores/UI.js";

export const kawasakiRulers = (vertex) => {
	const graph = get(CreasePattern);
	const origin = graph.vertices_coords[vertex];
	const rays = kawasakiSolutions(graph, vertex)
		.filter(a => a !== undefined)
		.map(vector => ({ origin, vector }))
		.map(line => ({ line, clamp: clampRay, domain: includeR }));
	RulersCP.set(rays);
};

export const kawasakiRulerPreviews = (vertex) => {
	const graph = get(CreasePattern);
	const origin = graph.vertices_coords[vertex];
	const rays = kawasakiSolutions(graph, vertex)
		.filter(a => a !== undefined)
		.map(vector => ({ origin, vector }))
		.map(line => ({ line, clamp: clampRay, domain: includeR }));
	GuideLinesCP.set(rays);
};
