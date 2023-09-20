import panel from "./panel.svelte";
import execute from "./execute.js";

export default {
	key: "undoHistory",
	name: "undo history",
	execute,
	panel,
}