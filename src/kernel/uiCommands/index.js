import { get } from "svelte/store";
import {
	add2,
	subtract2,
	scale2,
} from "rabbit-ear/math/vector.js";
import repeatFold from "rabbit-ear/graph/flatFold/repeatFold.js";
import { kawasakiSolutions } from "rabbit-ear/singleVertex/kawasaki.js";
import {
	Tool,
} from "../../stores/UI.js";
import Tools from "../../tools/index.js";
import { Highlight } from "../../stores/Select.js";
import { resetUI as ResetUI } from "../../stores/UI.js";
import {
	axiom1,
	axiom2,
	axiom3,
	axiom4,
	axiom5,
	axiom6,
	axiom7,
} from "../commands/axioms.js";
import {
	UIGraph,
	UILines,
	UIRays,
} from "../../stores/UI.js";
import {
	Graph,
} from "../../stores/Model.js";

export const resetUI = ResetUI;

export const resetToolUI = () => {
	const tool = get(Tool);
	if (tool && tool.reset) { tool.reset(); }
}

export const setTool = (toolName) => {
	const newTool = Tools[toolName];
	if (!newTool) { return; }
	Tool.set(newTool);
};

export const highlight = (components) => {
	if (!components) { return; }
	Highlight.reset();
	if (components.vertices) { Highlight.addEdges(components.vertices); }
	if (components.edges) { Highlight.addEdges(components.edges); }
	if (components.faces) { Highlight.addEdges(components.faces); }
};

export const axiom1Preview = (...args) => (
	UILines.set(axiom1(...args))
);
export const axiom2Preview = (...args) => (
	UILines.set(axiom2(...args))
);
export const axiom3Preview = (...args) => (
	UILines.set(axiom3(...args))
);
export const axiom4Preview = (...args) => (
	UILines.set(axiom4(...args))
);
export const axiom5Preview = (...args) => (
	UILines.set(axiom5(...args))
);
export const axiom6Preview = (...args) => (
	UILines.set(axiom6(...args))
);
export const axiom7Preview = (...args) => (
	UILines.set(axiom7(...args))
);

export const foldedLinePreview = (a, b) => {
	const line = { vector: subtract2(b, a), origin: a };
	// return repeatFold(get(Graph), line, "V");
	try {
		const result = repeatFold(get(Graph), line, "V")
			.filter(a => a !== undefined);
		// console.log("graph", {
		// 	vertices_coords: result.flatMap(el => el.points),
		// 	edges_vertices: result.map((_, i) => [i * 2, i * 2 + 1]),
		// });
		UIGraph.set({
			vertices_coords: result.flatMap(el => el.points),
			edges_vertices: result.map((_, i) => [i * 2, i * 2 + 1]),
		});
	} catch (error) {
		console.error(error);
	}
};

// export const pleatPreview = (...args) => (
// 	UILines.add(doPleat(get(Graph), ...args))
// );
export const pleatPreview = (...args) => (
	[]
);

export const kawasakiRulerPreviews = (vertex) => {
	const graph = get(Graph);
	const origin = graph.vertices_coords[vertex];
	const rays = kawasakiSolutions(graph, vertex)
		.filter(a => a !== undefined)
		.map(vector => ({ origin, vector }));
	UIRays.set(rays);
};
