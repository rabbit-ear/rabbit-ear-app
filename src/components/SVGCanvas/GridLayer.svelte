<script>
	export let viewBox = [0, 0, 1, 1];

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
	$: xs = makeIntervals(viewBox[0] - viewBox[2], viewBox[2] * 3);
	$: ys = makeIntervals(viewBox[1] - viewBox[3], viewBox[3] * 3);
</script>

<g class="grid" stroke-width={Math.max(viewBox[2], viewBox[3]) / 400}>
	<!-- <rect
		x={viewBox[0]}
		y={viewBox[1]}
		width={viewBox[2]}
		height={viewBox[3]}
		fill="none"
		stroke="red"
	/> -->

	{#each xs as x}
		<line
			x1={x}
			y1={viewBox[1] - viewBox[3]}
			x2={x}
			y2={viewBox[1] + viewBox[3] * 2}
		/>
	{/each}
	{#each ys as y}
		<line
			x1={viewBox[0] - viewBox[2]}
			y1={y}
			x2={viewBox[0] + viewBox[2] * 2}
			y2={y}
		/>
	{/each}
</g>

<style>
	line { stroke: var(--background-3); }
</style>
