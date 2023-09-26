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
		UILines,
		UIRays,
	} from "../../stores/UI.js";
	import { SnapPoints } from "../../stores/Snap.js";
	import { Tool } from "../../stores/UI.js";
	import { ViewBox } from "../../stores/ViewBox.js";

	let showRulers = true;
	$: showRulers = $Tool
		&& $Tool.name !== "edge"
		&& $Tool.name !== "folded line"

	$: rulerLineSegments = $RulerLines
		.map(line => clipLineInLargerViewBox(line, $ViewBox))
		.filter(res => res !== undefined)
		.filter(res => res.length > 1);

	$: rulerRaySegments = $RulerRays
		.map(ray => clipRayInLargerViewBox(ray, $ViewBox))
		.filter(res => res !== undefined)
		.filter(res => res.length > 1);

	$: uiLineSegments = $UILines
		.map(line => clipLineInLargerViewBox(line, $ViewBox))
		.filter(res => res !== undefined)
		.filter(res => res.length > 1);

	$: uiRaySegments = $UIRays
		.map(line => clipRayInLargerViewBox(line, $ViewBox))
		.filter(res => res !== undefined)
		.filter(res => res.length > 1);

	$: segments = rulerLineSegments
		.concat(rulerRaySegments)
		.concat(uiLineSegments)
		.concat(uiRaySegments);
</script>

<g class="ruler-line-layer">
	{#if showRulers}
		{#each segments as s}
			<line
				x1={s[0][0]}
				y1={s[0][1]}
				x2={s[1][0]}
				y2={s[1][1]}
				class="ruler-line animated-dashed-line"
			/>
		{/each}
	{/if}
</g>

<style>
	.ruler-line {
		stroke: var(--bright);
		/* stroke: var(--dim); */
	}
</style>
