import { get } from "svelte/store";
import {
	Tool,
} from "../../stores/UI.js";
import Tools from "../../tools/index.js";
import { Highlight } from "../../stores/Select.js";
import { resetUI as ResetUI } from "../../stores/UI.js";
import {
	doAxiom1,
	doAxiom2,
	doAxiom3,
	doAxiom4,
	doAxiom5,
	doAxiom6,
	doAxiom7,
} from "../../js/axioms.js";
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
	UILines.set(doAxiom1(get(Graph), ...args))
);
export const axiom2Preview = (...args) => (
	UILines.set(doAxiom2(get(Graph), ...args))
);
export const axiom3Preview = (...args) => (
	UILines.set(doAxiom3(get(Graph), ...args))
);
export const axiom4Preview = (...args) => (
	UILines.set(doAxiom4(get(Graph), ...args))
);
export const axiom5Preview = (...args) => (
	UILines.set(doAxiom5(get(Graph), ...args))
);
export const axiom6Preview = (...args) => (
	UILines.set(doAxiom6(get(Graph), ...args))
);
export const axiom7Preview = (...args) => (
	UILines.set(doAxiom7(get(Graph), ...args))
);
