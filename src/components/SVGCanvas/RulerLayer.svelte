<script>
	import {
		clipLineInLargerViewBox,
		clipRayInLargerViewBox,
	} from "../../js/intersect.js";
	import {
		RulerLines,
		RulerRays,
	} from "../../stores/Ruler.js";
	import {
		SymmetryLines,
	} from "../../stores/Symmetry.js";
	import {
		UILines,
		UIRays,
	} from "../../stores/UI.js";
	import { SnapPoints } from "../../stores/Snap.js";
	import { ToolNew } from "../../stores/Tool.js";
	import { ViewBox } from "../../stores/ViewBox.js";

	let showRulers = true;
	// $: showRulers = $Tool !== TOOL_EDGE
	// 	&& $Tool !== TOOL_FOLD_LINE;

	let vmax;
	$: vmax = Math.max($ViewBox[2], $ViewBox[3]);

	let segments;
	$: {
		const lineSegments = $RulerLines
			.map(line => clipLineInLargerViewBox(line, $ViewBox))
			.filter(res => res !== undefined)
			.filter(res => res.length > 1);
		const raySegments = $RulerRays
			.map(ray => clipRayInLargerViewBox(ray, $ViewBox))
			.filter(res => res !== undefined)
			.filter(res => res.length > 1);
		segments = lineSegments.concat(raySegments);
	};

	let segmentsPrev;
	$: {
		const lineSegments = $UILines
			.map(line => clipLineInLargerViewBox(line, $ViewBox))
			.filter(res => res !== undefined)
			.filter(res => res.length > 1);
		const raySegments = $UIRays
			.map(line => clipRayInLargerViewBox(line, $ViewBox))
			.filter(res => res !== undefined)
			.filter(res => res.length > 1);
		segmentsPrev = lineSegments.concat(raySegments);
	};

	let tick = 0
	setInterval(() => { tick += (vmax * 0.002); }, 30);
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
	 			stroke-dasharray={[vmax * 0.01, vmax * 0.01].join(" ")}
				stroke-dashoffset={tick}
			/>
		{/each}
		{#each segmentsPrev as s}
			<line
				x1={s[0][0]}
				y1={s[0][1]}
				x2={s[1][0]}
				y2={s[1][1]}
				class="preview-line"
	 			stroke-dasharray={[vmax * 0.01, vmax * 0.01].join(" ")}
				stroke-dashoffset={tick}
			/>
		{/each}
		<!-- {#each $SnapPoints as p}
			<circle cx={p[0]} cy={p[1]} r={0.01} fill="red" />
		{/each} -->
	{/if}
</g>

<!--
 			stroke-dasharray={[vmax * 0.01, vmax * 0.01].join(" ")}
			stroke-dashoffset={tick}
 -->
<style>
	.ruler-line {
/*		stroke: var(--highlight);*/
		stroke: var(--bright);
	}
	.preview-line {
		stroke: var(--dim);
	}
</style>