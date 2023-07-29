// import {
// 	axiom1 as fnAxiom1,
// 	axiom2 as fnAxiom2,
// 	axiom3 as fnAxiom3,
// 	axiom4 as fnAxiom4,
// 	axiom5 as fnAxiom5,
// 	axiom6 as fnAxiom6,
// 	axiom7 as fnAxiom7,
// } from "rabbit-ear/graph/axioms.js";
import {
	axiom1 as fnAxiom1,
	axiom2 as fnAxiom2,
	axiom3 as fnAxiom3,
	axiom4 as fnAxiom4,
	axiom5 as fnAxiom5,
	axiom6 as fnAxiom6,
	axiom7 as fnAxiom7,
} from "rabbit-ear/axioms/axiomsVecLine.js";
import { pointsToLine } from "rabbit-ear/math/general/convert.js";

const edgeToLine = ({ vertices_coords, edges_vertices }, edge) => (
	pointsToLine(edges_vertices[edge].map(v => vertices_coords[v]))
);

export const doAxiom1 = (graph, a, b) => a !== undefined && b !== undefined
	? fnAxiom1(a, b).filter(a => a !== undefined)
	: [];
export const doAxiom2 = (graph, a, b) => a !== undefined && b !== undefined
	? fnAxiom2(a, b).filter(a => a !== undefined)
	: [];
export const doAxiom3 = (graph, a, b) => a !== undefined && b !== undefined
	? fnAxiom3(...[a, b].map(e => edgeToLine(graph, e)))
		.filter(a => a !== undefined)
	: [];
export const doAxiom4 = (graph, a, b) => a !== undefined && b !== undefined
	? fnAxiom4(edgeToLine(graph, a), b).filter(a => a !== undefined)
	: [];
export const doAxiom5 = (graph, a, b, c) => (
	a !== undefined && b !== undefined && c !== undefined
		? fnAxiom5(edgeToLine(graph, a), b, c).filter(a => a !== undefined)
		: []);
export const doAxiom6 = (graph, a, b, c, d) => (
	a !== undefined && b !== undefined && c !== undefined && d !== undefined
		? fnAxiom6(edgeToLine(graph, a), edgeToLine(graph, b), c, d).filter(a => a !== undefined)
		: []);
export const doAxiom7 = (graph, a, b, c) => (
	a !== undefined && b !== undefined && c !== undefined
		? fnAxiom7(edgeToLine(graph, a), edgeToLine(graph, b), c).filter(a => a !== undefined)
		: []);
