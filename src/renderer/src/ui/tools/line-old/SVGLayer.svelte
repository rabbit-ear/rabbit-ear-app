<script>
	import state from "./state.svelte.ts";
	import { clipLineInViewBox } from "../../math/clip.svelte.ts";
	// import { renderer } from "../../stores/renderer.svelte.ts";

	const lineClipped = $derived(clipLineInViewBox(state.tool?.line));

	const svgLine = $derived.by(() => {
		if (!lineClipped) { return undefined; }
		const [[x1, y1], [x2, y2]] = lineClipped;
		return { x1, y1, x2, y2 };
	});

	const svgSegment = $derived.by(() => {
		if (!state.tool?.segment) { return undefined; }
		const [[x1, y1], [x2, y2]] = state.tool?.segment;
		return { x1, y1, x2, y2 };
	});

	const svgCircles = $derived(!state.tool?.segmentPoints
		? []
		: state.tool?.segmentPoints
			// .map(([cx, cy]) => ({ cx, cy, r: renderer.circleRadius })));
			.map(([cx, cy]) => ({ cx, cy, r: 0.02 })));
</script>

{#if svgLine}
	<line class="animated-dashed-line" {...svgLine} />
{/if}

{#if svgSegment}
	<line class="highlighted" {...svgSegment} />
{/if}

{#each svgCircles as circle}
	<circle {...circle} />
{/each}

<style>
	circle {
		fill: #fb4;
		stroke: none;
	}
	line {
		fill: none;
		stroke: var(--text);
	}
	.highlighted {
		stroke: #fb4;
		stroke-width: var(--stroke-dash-length);
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
