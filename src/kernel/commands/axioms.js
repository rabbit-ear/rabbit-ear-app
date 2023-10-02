import {
	axiom1 as coreAxiom1,
	axiom2 as coreAxiom2,
	axiom3 as coreAxiom3,
	axiom4 as coreAxiom4,
	axiom5 as coreAxiom5,
	axiom6 as coreAxiom6,
	axiom7 as coreAxiom7,
} from "rabbit-ear/axioms/axiomsVecLine.js";
// } from "rabbit-ear/graph/axioms.js";
import { pointsToLine } from "rabbit-ear/math/convert.js";
import { get } from "svelte/store";
import { CreasePattern } from "../../stores/Model.js";
import { RulerLines } from "../../stores/Ruler.js";
import { UILines } from "../../stores/UI.js";

const edgeToLine = ({ vertices_coords, edges_vertices }, edge) => (
	pointsToLine(...edges_vertices[edge].map(v => vertices_coords[v]))
);
// these axiom methods test the inputs before performing any
// calls to the method. if inputs are incomplete, return an empty array
const axiom1Safe = (graph, a, b) => a !== undefined && b !== undefined
	? coreAxiom1(a, b).filter(a => a !== undefined)
	: [];
const axiom2Safe = (graph, a, b) => a !== undefined && b !== undefined
	? coreAxiom2(a, b).filter(a => a !== undefined)
	: [];
const axiom3Safe = (graph, a, b) => a !== undefined && b !== undefined
	? coreAxiom3(...[a, b].map(e => edgeToLine(graph, e)))
		.filter(a => a !== undefined)
	: [];
const axiom4Safe = (graph, a, b) => a !== undefined && b !== undefined
	? coreAxiom4(edgeToLine(graph, a), b).filter(a => a !== undefined)
	: [];
const axiom5Safe = (graph, a, b, c) => (
	a !== undefined && b !== undefined && c !== undefined
		? coreAxiom5(edgeToLine(graph, a), b, c).filter(a => a !== undefined)
		: []);
const axiom6Safe = (graph, a, b, c, d) => (
	a !== undefined && b !== undefined && c !== undefined && d !== undefined
		? coreAxiom6(edgeToLine(graph, a), edgeToLine(graph, b), c, d).filter(a => a !== undefined)
		: []);
const axiom7Safe = (graph, a, b, c) => (
	a !== undefined && b !== undefined && c !== undefined
		? coreAxiom7(edgeToLine(graph, a), edgeToLine(graph, b), c).filter(a => a !== undefined)
		: []);

export const axiom1 = (...args) => (
	axiom1Safe(get(CreasePattern), ...args)
);
export const axiom2 = (...args) => (
	axiom2Safe(get(CreasePattern), ...args)
);
export const axiom3 = (...args) => (
	axiom3Safe(get(CreasePattern), ...args)
);
export const axiom4 = (...args) => (
	axiom4Safe(get(CreasePattern), ...args)
);
export const axiom5 = (...args) => (
	axiom5Safe(get(CreasePattern), ...args)
);
export const axiom6 = (...args) => (
	axiom6Safe(get(CreasePattern), ...args)
);
export const axiom7 = (...args) => (
	axiom7Safe(get(CreasePattern), ...args)
);

export const axiom1Rulers = (...args) => (
	RulerLines.set(axiom1(...args))
);
export const axiom2Rulers = (...args) => (
	RulerLines.set(axiom2(...args))
);
export const axiom3Rulers = (...args) => (
	RulerLines.set(axiom3(...args))
);
export const axiom4Rulers = (...args) => (
	RulerLines.set(axiom4(...args))
);
export const axiom5Rulers = (...args) => (
	RulerLines.set(axiom5(...args))
);
export const axiom6Rulers = (...args) => (
	RulerLines.set(axiom6(...args))
);
export const axiom7Rulers = (...args) => (
	RulerLines.set(axiom7(...args))
);

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

