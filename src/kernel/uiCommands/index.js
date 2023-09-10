import {
	Tool,
} from "../../stores/UI.js";
import Tools from "../../tools/index.js";
import { Highlight } from "../../stores/Select.js";
import { resetUI as ResetUI } from "../../stores/UI.js";

export const resetUI = ResetUI;

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
