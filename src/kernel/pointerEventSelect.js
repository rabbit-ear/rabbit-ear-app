import { intersectLineLine } from "rabbit-ear/math/intersect/intersect.js";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { includeS } from "rabbit-ear/math/general/function.js";
import { pointInBoundingBox } from "rabbit-ear/math/intersect/encloses.js";
import { get } from "svelte/store";
import {
	selectElement,
	selectionRect,
	selected,
	viewBox,
} from "../stores/app.js";
import { graph } from "../stores/graph.js";
import {
	presses,
	releases,
	moves,
} from "../stores/ui.js";
import {
	SELECT_VERTEX,
	SELECT_EDGE,
	SELECT_FACE,
} from "../js/enums.js";

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

const rectFromTwoPoints = (p, q) => {
	const xs = [p[0], q[0]].sort((a, b) => a - b);
	const ys = [p[1], q[1]].sort((a, b) => a - b);
	return {
		min: [xs[0], ys[0]],
		max: [xs[1], ys[1]],
		span: [xs[1] - xs[0], ys[1] - ys[0]],
	};
};

const getNearestToPoint = (graph, point) => {
	const result = { vertices: [], edges: [], faces: [] };
	const near = nearest(graph, point);
	result.vertices[near.vertex] = true;
	result.edges[near.edge] = true;
	result.faces[near.face] = true;
	return result;
};

const getSelectedGraph = (graph, rect) => {
	if (!rect) { return { vertices: [], edges: [], faces: [] }; }
	const vertices = graph.vertices_coords
		.map(p => pointInRect(p, rect));
	// const edges = [];
	const edges = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]))
		.map(segment => segmentBoxOverlap(segment, rect));
	const faces = graph.faces_edges
		? graph.faces_edges
			.map(fe => fe.map(e => edges[e]))
			.map(face => face.reduce((a, b) => a || b, false))
		: graph.faces_vertices
		// const faces = graph.faces_vertices
			.map(fv => fv.map(v => vertices[v]))
			.map(face => face.reduce((a, b) => a || b, false));
	return { vertices, edges, faces };
};
/**
 *
 */
const filterNearest = (nears) => {
	switch (get(selectElement)) {
	case SELECT_VERTEX: return { vertices: nears.vertices, edges: [], faces: [] };
	case SELECT_EDGE: return { vertices: [], edges: nears.edges, faces: [] };
	case SELECT_FACE: return { vertices: [], edges: [], faces: nears.faces };
	default: return nears;
	}
};
/**
 *
 */
export const pointerEventSelect = (eventType) => {
	const graphValue = get(graph);
	const viewBoxValue = get(viewBox);
	const vmax = Math.max(viewBoxValue[2], viewBoxValue[3]);
	switch (eventType) {
	case "press": {
		moves.set([]);
		releases.set([]);
		selectionRect.set(undefined);
		const nears = getNearestToPoint(graphValue, get(presses)[get(presses).length - 1]);
		selected.set(filterNearest(nears));
	}
		break;
	case "move": {
		if (!get(presses).length || !get(moves).length) {
			selectionRect.set(undefined);
			break;
		}
		selectionRect.set(rectFromTwoPoints(
			get(presses)[get(presses).length - 1],
			get(moves)[get(moves).length - 1],
		))
		// selected.set(getSelectedGraph(graphValue, get(selectionRect)));
		const degenerateSelection = get(selectionRect) === undefined
			|| Math.max(...get(selectionRect).span) < vmax * 0.01;
		const nears = degenerateSelection
			? getNearestToPoint(graphValue, get(presses)[get(presses).length - 1])
			: getSelectedGraph(graphValue, get(selectionRect));
		selected.set(filterNearest(nears));
	}
		break;
	case "release": {
		const degenerateSelection = get(selectionRect) === undefined
			|| Math.max(...get(selectionRect).span) < vmax * 0.01;
		const nears = degenerateSelection
			? getNearestToPoint(graphValue, get(releases)[get(releases).length - 1])
			: getSelectedGraph(graphValue, get(selectionRect));
		selected.set(filterNearest(nears));
		selectionRect.set(undefined);
		presses.set([]);
		moves.set([]);
		releases.set([]);
	}
		break;
	}
};
