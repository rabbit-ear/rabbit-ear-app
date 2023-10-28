import { get } from "svelte/store";
import { UpdateFrame } from "../../stores/Model.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import Planarize from "rabbit-ear/graph/planarize.js";
import populate from "rabbit-ear/graph/populate.js";

// export const planarize = () => (
// 	UpdateFrame(populate(Planarize(get(CreasePattern)), true))
// );

export const planarize = () => {
	const graph = get(CreasePattern);
	if (!graph || !graph.vertices_coords || !graph.edges_vertices) {
		return;
	}
	try {
		UpdateFrame(populate(Planarize(graph), true));
	} catch (error) {

	}
};
