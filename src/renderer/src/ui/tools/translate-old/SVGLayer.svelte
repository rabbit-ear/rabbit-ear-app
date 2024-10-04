<script lang="ts">
	import { add2 } from "rabbit-ear/math/vector.js";
	import state from "./state.svelte.ts";

	const line = $derived(!state.tool || !state.tool.vector
		? undefined
		: [
			state.tool.presses[0],
			add2(state.tool.presses[0], state.tool.vector),
		]);

	const svgLine = $derived(!line ? undefined : {
		x1: line[0][0],
		y1: line[0][1],
		x2: line[1][0],
		y2: line[1][1],
	});
</script>

{#if svgLine}
	<line {...svgLine} />
{/if}

<style>
	line {
		stroke: #fb4;
	}
</style>
