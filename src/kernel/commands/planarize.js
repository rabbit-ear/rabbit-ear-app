import { get } from "svelte/store";
import { planarize as Planarize } from "rabbit-ear/graph/planarize.js";
import { populate } from "rabbit-ear/graph/populate.js";
import { getEdgesLine } from "rabbit-ear/graph/edges/lines.js";
import { UpdateFrame } from "../../stores/Model.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import {
	Precision,
	Sqrt2Lookup,
} from "../../stores/Sqrt2.js";
import { cleanNumber } from "../../js/epsilon.js";
/**
 *
 */
export const planarize = () => {
	const graph = get(CreasePattern);
	if (!graph || !graph.vertices_coords || !graph.edges_vertices) {
		return;
	}
	try {
		// const precision = get(Precision);
		// const lookup = get(Sqrt2Lookup);
		// const edgesLines = getEdgesLine(graph);
		// edgesLines.lines.forEach(el => {
		// 	el.vector = el.vector.map(n => cleanNumber(n, precision, lookup));
		// 	el.origin = el.origin.map(n => cleanNumber(n, precision, lookup));
		// });
		UpdateFrame(populate(Planarize(graph), { faces: true }));
	} catch (error) {

	}
};
