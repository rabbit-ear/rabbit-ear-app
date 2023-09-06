import { add2, subtract2 } from "rabbit-ear/math/vector.js";
// import normalize from "rabbit-ear/graph/normalize.js";
import { get } from "svelte/store";
import { Selection, Highlight } from "../../stores/Select.js";
import { Graph } from "../../stores/Model.js";
import { UIGraph } from "../../stores/UI.js";
import { snapToVertex, snapToPoint } from "../../js/snap.js";
import { subgraphWithVertices, normalize } from "../../js/subgraph.js";
import execute from "../../kernel/execute.js";

let pressVertex;
let pressCoords;

const getDragVector = (point) => (!pressCoords || !point)
	? [0, 0]
	:subtract2(point, pressCoords);

const pointerEventVertex = (eventType, { point }) => {
	Highlight.reset();
	switch (eventType) {
	case "hover": {
		const { coords, vertex } = snapToVertex(point, false);
		if (vertex !== undefined) { Highlight.addVertices([vertex]); }
	}
		break;
	case "press": {
		const { coords, vertex } = snapToVertex(point, false);
		if (vertex !== undefined) {
			pressCoords = coords;
			pressVertex = vertex;
			Selection.reset();
			Selection.addVertices([vertex]);
			break;
		}
		execute("addVertex", coords);
	}
		break;
	case "move": {
		const coords = snapToPoint(point, false);
		const dragVector = getDragVector(coords);
		const selVerts = get(Selection).vertices;
		const subgraph = subgraphWithVertices(get(Graph), selVerts);
		selVerts.forEach(v => {
			subgraph.vertices_coords[v] = add2(subgraph.vertices_coords[v], dragVector);
		});
		normalize(subgraph);
		UIGraph.set({ ...subgraph });
	}
		break;
	case "release": {
		const coords = snapToPoint(point, false);
		const dragVector = getDragVector(coords);
		UIGraph.set({});
		// move currently selected vertices
		execute("translateVertices", get(Selection).vertices, dragVector);
		Selection.reset();
	}
		break;
	}
};

export default pointerEventVertex;
