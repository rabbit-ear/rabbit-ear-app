<script lang="ts">
	import { add2, normalize2, scale2 } from "rabbit-ear/math/vector.js";
	import { clockwiseAngle2, counterClockwiseAngle2 } from "rabbit-ear/math/radial.js";
	import { arcPath } from "./arc.ts";
	import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
	import type { SVGFixedPoint } from "./SVGFixedPoint.svelte.ts";
	import ToolOrigin from "./ToolOrigin.svelte";

	type PropsType = {
		fixedPoint: SVGFixedPoint;
		startVector: [number, number] | undefined;
		endVector: [number, number] | undefined;
		origin: [number, number];
		showRotation: boolean;
		viewport: SVGViewport;
	};
	let { fixedPoint, startVector, endVector, origin, showRotation, viewport }: PropsType =
		$props();

	const vectors = $derived([startVector, endVector].filter((a) => a !== undefined));

	const lines = $derived(
		vectors
			.map((vec) => scale2(normalize2(vec), viewport.view.vmin * 0.1))
			.map((vec) => add2(origin, vec))
			.map((point) => [origin, point]),
	);

	const svgLines = $derived(
		lines.map((line) => ({
			x1: line[0][0],
			y1: line[0][1],
			x2: line[1][0],
			y2: line[1][1],
		})),
	);

	const angles = $derived(
		vectors.length === 2
			? [
					-clockwiseAngle2(vectors[0], vectors[1]),
					counterClockwiseAngle2(vectors[0], vectors[1]),
				]
			: undefined,
	);

	const angle = $derived(
		angles
			? Math.abs(angles[0]) < Math.abs(angles[1])
				? angles[0]
				: angles[1]
			: undefined,
	);

	const wedge = $derived(
		angle
			? arcPath(
					origin[0],
					origin[1],
					viewport.view.vmin * 0.05,
					Math.atan2(vectors[0][1], vectors[0][0]),
					Math.atan2(vectors[0][1], vectors[0][0]) + angle,
					true,
				)
			: undefined,
	);
</script>

<ToolOrigin {fixedPoint} {viewport} />

{#if showRotation}
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
