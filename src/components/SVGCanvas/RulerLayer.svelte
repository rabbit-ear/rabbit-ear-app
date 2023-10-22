<script>
	import {
		subtract2,
		parallel,
	} from "rabbit-ear/math/vector.js";
	import {
		clipLineFuncInLargerViewport,
		clipLineInLargerViewport,
		clipRayInLargerViewport,
	} from "../../js/intersect.js";
	import {
		RulersCP,
	} from "../../stores/Ruler.js";
	import {
		UILines,
		UIRays,
	} from "../../stores/UI.js";
	import { Tool } from "../../stores/UI.js";

	export let viewport = [0, 0, 1, 1];

	let showRulers = true;
	$: showRulers = $Tool
		&& $Tool.name !== "edge"
		&& $Tool.name !== "folded line"

	$: rulerSegments = $RulersCP
		.map(ruler => clipLineFuncInLargerViewport(ruler.line, ruler.domain, viewport))
		.filter(res => res !== undefined)
		.filter(res => res.length > 1);

	// $: rulerLineSegments = $RulerLines
	// 	.map(line => clipLineInLargerViewport(line, viewport))
	// 	.filter(res => res !== undefined)
	// 	.filter(res => res.length > 1);

	// $: rulerRaySegments = $RulerRays
	// 	.map(ray => clipRayInLargerViewport(ray, viewport))
	// 	.filter(res => res !== undefined)
	// 	.filter(res => res.length > 1);

	$: uiLineSegments = $UILines
		.map(line => clipLineInLargerViewport(line, viewport))
		.filter(res => res !== undefined)
		.filter(res => res.length > 1);

	$: uiRaySegments = $UIRays
		.map(line => clipRayInLargerViewport(line, viewport))
		.filter(res => res !== undefined)
		.filter(res => res.length > 1);

	// $: segments = rulerLineSegments
	// 	.concat(rulerRaySegments)
	// 	.concat(uiLineSegments)
	// 	.concat(uiRaySegments)
	// 	.filter(a => a !== undefined);

	$: segments = rulerSegments
		.concat(uiLineSegments)
		.concat(uiRaySegments)
		.filter(a => a !== undefined);

	// this is a work-around for an unfortunate rendering bug in Safari,
	// Safari has an issue rendering stroke-dasharray css animations but
	// only when the lines are vertical or horizontal (go figure?).
	// detect when this is the case, render these lines without animation.
	// $: segmentsRectilinear = segments
	// 	.map(([p0, p1]) => subtract2(p1, p0))
	// 	.map(vector => parallel(vector, [1, 0]) || parallel(vector, [0, 1]));
	// here is an alternate solution (this is wild that this works)
	// use a path instead of line, append a small little diagonal bit at the end
	$: hack = `l${[viewport[2] * 0.1, viewport[2] * 0.1].join(",")}`;
</script>

<g class="ruler-line-layer">
	{#if showRulers}
		{#each segments as s, i}
			<!-- <line
				x1={s[0][0]}
				y1={s[0][1]}
				x2={s[1][0]}
				y2={s[1][1]}
				class={segmentsRectilinear[i]
					? "ruler-line dashed-line"
					: "ruler-line animated-dashed-line"}
			/> -->
			<path
				d={`M${s[0].join(",")}L${s[1].join(",")}${hack}`}
				class="ruler-line animated-dashed-line"
			/>
		{/each}
	{/if}
</g>

<style>
	.ruler-line {
		fill: none;
		stroke: var(--bright);
	}
	@keyframes animate-dash {
		from { stroke-dashoffset: 0; }
		to { stroke-dashoffset: calc(500pt * var(--stroke-dash-length)); }
	}
	.animated-dashed-line {
		stroke-dasharray: var(--stroke-dash-length);
		animation: 60s linear 0s infinite reverse both running animate-dash;
	}
</style>
