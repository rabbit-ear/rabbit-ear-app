import { writable } from "svelte/store";

export const SymmetryLines = writable([
	{ vector: [1, 1], origin: [0, 0] },
]);

SymmetryLines.add = (line) => SymmetryLines
	.update(lines => [...lines, line]);