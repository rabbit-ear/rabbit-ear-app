import { writable } from "svelte/store";

export const ReflectionLines = writable([
	{ vector: [1, 1], origin: [0, 0] },
]);

ReflectionLines.add = (line) => ReflectionLines
	.update(lines => [...lines, line]);
