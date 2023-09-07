<script>
	import {
		clipLineInLargerViewBox,
		clipRayInLargerViewBox,
	} from "../../js/intersect.js";
	import {
		SymmetryLines,
	} from "../../stores/Symmetry.js";
	import { ToolNew } from "../../stores/Tool.js";
	import { ViewBox } from "../../stores/ViewBox.js";

	let showRulers = true;
	// $: showRulers = $Tool === TOOL_SYMMETRY;

	let vmax;
	$: vmax = Math.max($ViewBox[2], $ViewBox[3]);

	let segments;
	$: {
		segments = $SymmetryLines
			.map(line => clipLineInLargerViewBox(line, $ViewBox))
			.filter(res => res !== undefined)
			.filter(res => res.length > 1);
	};

	// let tick = 0
	// setInterval(() => { tick += (vmax * 0.002); }, 30);
</script>

<g>
	{#if showRulers}
		{#each segments as s}
			<line
				x1={s[0][0]}
				y1={s[0][1]}
				x2={s[1][0]}
				y2={s[1][1]}
				class="ruler-line"
			/>
		{/each}
	{/if}
</g>

<!--
				stroke-dasharray={[vmax * 0.01, vmax * 0.01].join(" ")}
				stroke-dashoffset={tick}
-->

<style>
	.ruler-line {
		stroke: var(--bright);
	}
</style>