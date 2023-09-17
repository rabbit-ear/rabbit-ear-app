import { get } from "svelte/store";
import Tools from "../../tools/index.js";
import { Tool } from "../../stores/UI.js";

export const resetTool = () => {
	const tool = get(Tool);
	if (tool && tool.reset) { tool.reset(); }
}

export const setTool = (toolName) => {
	const newTool = Tools[toolName];
	if (!newTool) { return; }
	Tool.set(newTool);
};
