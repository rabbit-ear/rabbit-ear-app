<script>
	import { viewBoxOrigin } from "../../js/matrix.js";

	export let viewport = [0, 0, 1, 1];

	$: origin = viewBoxOrigin(viewport, true);
	$: strokeWidth = Math.max(viewport[2], viewport[3]) / 400;
	/**
	 * @description create a set of evenly spaced intervals that fit
	 * inside the viewbox, one dimension at a time.
	 * @param {number} the viewbox corner (origin, x or y)
	 * @param {number} the viewbox size (width or height)
	 */
	const makeIntervals = (start, size) => {
		let spacing = 1;
		while ((size / spacing) > 64) { spacing *= 2; }
		const count = parseInt(size / spacing);
		const offset = Math.ceil(start / spacing) * spacing;
		return Array.from(Array(count + 1))
			.map((_, i) => offset + spacing * i);
	};

	let xs = [];
	let ys = [];
	$: xs = makeIntervals(origin[0] - viewport[2]*1, viewport[2] * 3);
	$: ys = makeIntervals(origin[1] - viewport[3]*1, viewport[3] * 4);
</script>

<g class="grid" stroke-width={strokeWidth}>
	<!-- <rect
		x={origin[0]}
		y={origin[1]}
		width={viewport[2]}
		height={viewport[3]}
		fill="none"
		stroke="red"
	/> -->

	{#each xs as x}
		<line
			x1={x}
			y1={origin[1] - viewport[3]}
			x2={x}
			y2={origin[1] + viewport[3] * 3}
		/>
	{/each}
	{#each ys as y}
		<line
			x1={viewport[0] - viewport[2]}
			y1={y}
			x2={viewport[0] + viewport[2] * 2}
			y2={y}
		/>
	{/each}
</g>

<style>
	line { stroke: var(--background-3); }
</style>
