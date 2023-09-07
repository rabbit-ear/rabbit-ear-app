import { get } from "svelte/store";
import { intersectLineLine } from "rabbit-ear/math/intersect.js";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { includeS } from "rabbit-ear/math/compare.js";
// import { pointInBoundingBox } from "rabbit-ear/math/encloses.js";
import { ViewBox } from "../stores/ViewBox.js";
import { ElementSelect } from "../stores/UI.js";
import { SelectionRect } from "../stores/Select.js";
import { Graph } from "../stores/Model.js";
import { Releases } from "../stores/UI.js";
import {
	SELECT_VERTEX,
	SELECT_EDGE,
	SELECT_FACE,
} from "../app/keys.js";

const pointInRect = (p, rect) => (
	p[0] > rect.min[0] && p[0] < rect.max[0] &&
	p[1] > rect.min[1] && p[1] < rect.max[1]
);

const segmentBoxOverlap = (segment, box) => {
	const boxSegments = [
		[box.min, [box.max[0], box.min[1]]],
		[[box.max[0], box.min[1]], box.max],
		[box.max, [box.min[0], box.max[1]]],
		[[box.min[0], box.max[1]], box.min],
	];
	const line = {
		vector: [
			segment[1][0] - segment[0][0],
			segment[1][1] - segment[0][1],
		],
		origin: segment[0],
	};
	const boxVectors = boxSegments
		.map(seg => [seg[1][0] - seg[0][0], seg[1][1] - seg[0][1]]);
	const boxLines = boxVectors
		.map((vector, i) => ({ vector, origin: boxSegments[i][0] }))
	const segmentIntersects = boxSegments
		.map((seg, i) => intersectLineLine(line, boxLines[i], includeS, includeS));
	const anySegmentIntersects = segmentIntersects
		.reduce((a, b) => a || b, false);
	if (anySegmentIntersects) { return true; }
	//const ptInside = pointInBoundingBox(segment[0], box);
	const ptInside = pointInRect(segment[0], box);
	return ptInside;
};

const getSelectedFromPoint = (graph, point) => {
	const near = nearest(graph, point);
	return {
		vertices: [near.vertex],
		edges: [near.edge],
		faces: [near.face],
	};
};

const getSelectedFromRect = (graph, rect) => {
	if (!rect) { return { vertices: [], edges: [], faces: [] }; }
	const verticesLookup = graph.vertices_coords
		.map(p => pointInRect(p, rect));
	const vertices = verticesLookup
		.map((sel, i) => sel ? i : undefined)
		.filter(a => a !== undefined);
	const edgesLookup = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]))
		.map(segment => segmentBoxOverlap(segment, rect));
	const edges = edgesLookup
		.map((sel, i) => sel ? i : undefined)
		.filter(a => a !== undefined);
	const faces = graph.faces_edges
		? graph.faces_edges
			.map(fe => fe.map(e => edgesLookup[e]))
			.map(face => face.reduce((a, b) => a || b, false))
			.map((sel, i) => sel ? i : undefined)
			.filter(a => a !== undefined)
		: graph.faces_vertices
		// const faces = graph.faces_vertices
			.map(fv => fv.map(v => verticesLookup[v]))
			.map(face => face.reduce((a, b) => a || b, false))
			.map((sel, i) => sel ? i : undefined)
			.filter(a => a !== undefined);
	return { vertices, edges, faces };
};

const vefName = {
	[SELECT_VERTEX]: "vertices",
	[SELECT_EDGE]: "edges",
	[SELECT_FACE]: "faces",
};

/**
 * @description get the selected components inside the SelectionRect
 */
export const getSelected = () => {
	const graphValue = get(Graph);
	const vb = get(ViewBox);
	const vmax = Math.max(vb[2], vb[3]);
	const degenerateSelection = get(SelectionRect) === undefined
		|| Math.max(...get(SelectionRect).span) < vmax * 0.01;
	const nears = degenerateSelection
		? getSelectedFromPoint(graphValue, get(Releases)[get(Releases).length - 1])
		: getSelectedFromRect(graphValue, get(SelectionRect));
	return nears[vefName[get(ElementSelect)]];
};
