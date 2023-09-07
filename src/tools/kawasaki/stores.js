import { derived } from "svelte/store";
import { Presses, Releases } from "../../stores/UI.js";

export const ToolStep = derived(
	[Presses, Releases],
	([$Presses, $Releases]) => {
		const pressesCount = $Presses.length;
		const releasesCount = $Releases.length;
		if (pressesCount === 0) { return 0; }
		if (pressesCount === 1 && releasesCount === 0) { return 1; }
		if (pressesCount === 1 && releasesCount === 1) { return 2; }
		if (pressesCount === 2 && releasesCount === 1) { return 3; }
		if (pressesCount === 2 && releasesCount === 2) { return 4; }
		return Infinity;
	},
	0,
);
