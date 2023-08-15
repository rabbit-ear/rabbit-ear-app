<script>
	import { ViewBox } from "../../stores/ViewBox.js";
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
	$: xs = makeIntervals($ViewBox[0] - $ViewBox[2], $ViewBox[2] * 3);
	$: ys = makeIntervals($ViewBox[1] - $ViewBox[3], $ViewBox[3] * 3);
</script>

<g class="grid" stroke-width={Math.max($ViewBox[2], $ViewBox[3]) / 400}>
<!-- 	<rect
		x={$ViewBox[0] + $ViewBox[2] * 0.05}
		y={$ViewBox[1] + $ViewBox[3] * 0.05}
		width={$ViewBox[2] - $ViewBox[2] * 0.1}
		height={$ViewBox[3] - $ViewBox[3] * 0.1}
		fill="none"
		stroke="red"
	/> -->

	{#each xs as x}
		<line
			x1={x}
			y1={$ViewBox[1] - $ViewBox[3]}
			x2={x}
			y2={$ViewBox[1] + $ViewBox[3] * 2}
		/>
	{/each}
	{#each ys as y}
		<line
			x1={$ViewBox[0] - $ViewBox[2]}
			y1={y}
			x2={$ViewBox[0] + $ViewBox[2] * 2}
			y2={y}
		/>
	{/each}
</g>
