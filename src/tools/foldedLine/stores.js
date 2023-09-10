import {
	writable,
	derived,
} from "svelte/store";
import { zipArrays } from "../../js/arrays.js";

export const Move = writable(undefined);
export const Presses = writable([]);
export const Releases = writable([]);

export const Touches = derived(
	[Move, Presses, Releases],
	([$Move, $Presses, $Releases]) => zipArrays($Presses, $Releases)
		.concat([$Move])
		.filter(a => a !== undefined),
	[],
);
