import { nearest } from "rabbit-ear/graph/nearest.js";
import remove from "rabbit-ear/graph/remove.js";
import { get } from "svelte/store";
import { Selection } from "../stores/Select.js";
import { Graph } from "../stores/Graph.js";
import { ViewBox } from "../stores/ViewBox.js";
import { ElementSelect } from "../stores/Tool.js";

let pressEdge;

const getSelected = (point) => {
	const graph = get(Graph);
	const viewBox = get(ViewBox);
	const vmax = Math.max(viewBox[2], viewBox[3]);
	const near = nearest(graph, point);
	const nears = {
		vertices: [near.vertex],
		edges: [near.edge],
		faces: [near.face],
	};
	// return nears[get(ElementSelect)];
	return nears;
};

export const pointerEventDelete = (eventType, { point }) => {
	Selection.reset();
	const selected = getSelected(point);
	Selection.addEdges(selected.edges);
	switch (eventType) {
	case "hover": break;
	case "press":
		pressEdge = selected.edges[0];
		break;
	case "move": break;
	case "release":
		if (pressEdge !== undefined && pressEdge === selected.edges[0]) {
			Graph.update(graph => {
				remove(graph, "edges", [pressEdge]);
				return graph;
			});
		}
		break;
	}
};
