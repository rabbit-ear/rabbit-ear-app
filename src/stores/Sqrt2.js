import { writable, derived } from "svelte/store";

export const Precision = writable(7);

export const Sqrt2Lookup = derived(
	Precision,
	($Precision) => MakeSqrt2Lookup($Precision),
	{},
);
