import {
	include,
	includeL,
	includeR,
	includeS,
	excludeS,
} from "rabbit-ear/math/compare.js";
import { pointsToLine } from "rabbit-ear/math/convert.js";
import { intersectLineLine } from "rabbit-ear/math/intersect.js";
import { clipLineConvexPolygon } from "rabbit-ear/math/clip.js";
import { makeEdgesVector } from "rabbit-ear/graph/make.js";

export const intersectGraphLineFunc = (graph, line, lineFn = includeL) => {
	const edgesOrigin = graph.edges_vertices
		.map(v => graph.vertices_coords[v[0]]);
	const edgesVector = makeEdgesVector(graph);
	const edgesLine = edgesVector
		.map((vector, i) => ({ vector, origin: edgesOrigin[i] }));
	return edgesLine
		.map(l => intersectLineLine(line, l, lineFn, excludeS).point)
		.filter(a => a !== undefined);
};

export const intersectGraphLine = (graph, line) => (
	intersectGraphLineFunc(graph, line, includeL)
);

export const intersectGraphRay = (graph, ray) => (
	intersectGraphLineFunc(graph, ray, includeR)
);

// export const intersectGraphSegment = (graph, segment) => (
// 	intersectGraphLineFunc(graph, pointsToLine(...segment), includeS)
// );

// const clipLineInViewport = (line, box, lineFn = includeL) => {
// 	const polygon = [
// 		[box[0], box[1]],
// 		[box[0] + box[2], box[1]],
// 		[box[0] + box[2], box[1] + box[3]],
// 		[box[0], box[1] + box[3]],
// 	];
// 	return clipLineConvexPolygon(polygon, line, include, lineFn);
// };

export const clipLineFuncInLargerViewport = (line, lineFn = includeL, box) => {
	const [x, y, w, h] = box;
	const polygon = [
		[x - (w * 10), y - (h * 10)],
		[x + (w * 11), y - (h * 10)],
		[x + (w * 11), y + (h * 11)],
		[x - (w * 10), y + (h * 11)],
	];
	return clipLineConvexPolygon(polygon, line, include, lineFn);
};

export const clipLineInLargerViewport = (line, box) => (
	clipLineFuncInLargerViewport(line, includeL, box)
);

export const clipRayInLargerViewport = (line, box) => (
	clipLineFuncInLargerViewport(line, includeR, box)
);
