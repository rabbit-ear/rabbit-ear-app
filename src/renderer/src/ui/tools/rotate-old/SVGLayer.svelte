<script lang="ts">
	import { add2, normalize2, scale2 } from "rabbit-ear/math/vector.js";
	// import { renderer } from "../../stores/renderer.svelte.ts";
	import ToolOrigin from "./ToolOrigin.svelte";
	import state from "./state.svelte.ts";
	import { clockwiseAngle2, counterClockwiseAngle2 } from "rabbit-ear/math/radial.js";

	export const polarToCartesian = (a, d) => [Math.cos(a) * d, Math.sin(a) * d];

	const arcPath = (x, y, radius, startAngle, endAngle, includeCenter = false) => {
		if (endAngle == null) { return ""; }
		const start = polarToCartesian(startAngle, radius);
		const end = polarToCartesian(endAngle, radius);
		const arcVec = [end[0] - start[0], end[1] - start[1]];
		const py = start[0] * end[1] - start[1] * end[0];
		const px = start[0] * end[0] + start[1] * end[1];
		const arcdir = (Math.atan2(py, px) > 0 ? 0 : 1);
		let d = (includeCenter
			? `M ${x},${y} l ${start[0]},${start[1]} `
			: `M ${x + start[0]},${y + start[1]} `);
		d += ["a ", radius, radius, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
		if (includeCenter) { d += " Z"; }
		return d;
	};

	const vectors = $derived([state.tool?.startVector, state.tool?.endVector]
		.filter(a => a !== undefined));

	// that safety thing is not right
	const origin: [number, number] = $derived(state.fixedPoint?.origin || [0, 0]);

	const lines = $derived(vectors
		.map(vec => scale2(normalize2(vec), renderer.view.vmin * 0.1))
		.map(vec => add2(origin, vec))
		.map(point => [origin, point]));

	const svgLines = $derived(lines.map(line => ({
		x1: line[0][0],
		y1: line[0][1],
		x2: line[1][0],
		y2: line[1][1],
	})));

	const angles = $derived(vectors.length === 2
		? [-clockwiseAngle2(vectors[0], vectors[1]),
			counterClockwiseAngle2(vectors[0], vectors[1])]
		: undefined);

	const angle = $derived(angles
		? Math.abs(angles[0]) < Math.abs(angles[1]) ? angles[0] : angles[1]
		: undefined);

	const wedge = $derived(angle
		? arcPath(origin[0],
			origin[1],
			// todo
			// renderer.view.vmin * 0.05,
			0.005,
			Math.atan2(vectors[0][1], vectors[0][0]),
			Math.atan2(vectors[0][1], vectors[0][0]) + angle,
			true)
		: undefined);
</script>

<ToolOrigin />

{#if state.tool?.showAngleIndicator}
	{#each svgLines as line}
		<line {...line} />
	{/each}

	{#if wedge}
		<path d={wedge} />
	{/if}
{/if}

<style>
	line {
		stroke: #fb4;
	}
	path {
		stroke: none;
		fill: #fb4;
	}
</style>
