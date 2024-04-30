import {
	axiom1 as coreAxiom1,
	axiom2 as coreAxiom2,
	axiom3 as coreAxiom3,
	axiom4 as coreAxiom4,
	axiom5 as coreAxiom5,
	axiom6 as coreAxiom6,
	axiom7 as coreAxiom7,
} from "rabbit-ear/axioms/axioms.js";
import { clampLine } from "rabbit-ear/math/line.js";
import { includeL } from "rabbit-ear/math/compare.js";
import { pointsToLine } from "rabbit-ear/math/convert.js";
import { get } from "svelte/store";
import { CreasePattern } from "../../stores/ModelCP.js";
import { FoldedForm } from "../../stores/ModelFolded.js";
// import { RulersCP } from "../../stores/Ruler.js";
// import { GuideLinesCP } from "../../stores/UI.js";

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

export const foldedAxiom1 = (...args) => (
	axiom1Safe(get(FoldedForm), ...args)
);
export const foldedAxiom2 = (...args) => (
	axiom2Safe(get(FoldedForm), ...args)
);
export const foldedAxiom3 = (...args) => (
	axiom3Safe(get(FoldedForm), ...args)
);
export const foldedAxiom4 = (...args) => (
	axiom4Safe(get(FoldedForm), ...args)
);
export const foldedAxiom5 = (...args) => (
	axiom5Safe(get(FoldedForm), ...args)
);
export const foldedAxiom6 = (...args) => (
	axiom6Safe(get(FoldedForm), ...args)
);
export const foldedAxiom7 = (...args) => (
	axiom7Safe(get(FoldedForm), ...args)
);

// export const axiom1Rulers = (...args) => (
// 	// RulerLines.set(axiom1(...args))
// 	RulersCP.set(axiom1(...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );
// export const axiom2Rulers = (...args) => (
// 	// RulerLines.set(axiom2(...args))
// 	RulersCP.set(axiom2(...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );
// export const axiom3Rulers = (...args) => (
// 	// RulerLines.set(axiom3(...args))
// 	RulersCP.set(axiom3(...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );
// export const axiom4Rulers = (...args) => (
// 	// RulerLines.set(axiom4(...args))
// 	RulersCP.set(axiom4(...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );
// export const axiom5Rulers = (...args) => (
// 	// RulerLines.set(axiom5(...args))
// 	RulersCP.set(axiom5(...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );
// export const axiom6Rulers = (...args) => (
// 	// RulerLines.set(axiom6(...args))
// 	RulersCP.set(axiom6(...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );
// export const axiom7Rulers = (...args) => (
// 	// RulerLines.set(axiom7(...args))
// 	RulersCP.set(axiom7(...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );

// export const axiom1Preview = (...args) => (
// 	GuideLinesCP.set(axiom1(...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );
// export const axiom2Preview = (...args) => (
// 	GuideLinesCP.set(axiom2(...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );
// export const axiom3Preview = (...args) => (
// 	GuideLinesCP.set(axiom3(...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );
// export const axiom4Preview = (...args) => (
// 	GuideLinesCP.set(axiom4(...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );
// export const axiom5Preview = (...args) => (
// 	GuideLinesCP.set(axiom5(...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );
// export const axiom6Preview = (...args) => (
// 	GuideLinesCP.set(axiom6(...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );
// export const axiom7Preview = (...args) => (
// 	GuideLinesCP.set(axiom7(...args)
// 		.map(line => ({ line, clamp: clampLine, domain: includeL })))
// );

