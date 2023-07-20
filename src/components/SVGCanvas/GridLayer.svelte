<script>
	import { ViewBox } from "../../stores/ViewBox.js";

	// let strokeWidth;
	// $: strokeWidth = 

	let xs = [];
	let ys = [];
	$: {
		let xSpacing = 1;
		while (($ViewBox[2] / xSpacing) > 32) { xSpacing *= 2; }
		const xCount = parseInt($ViewBox[2] / xSpacing);
		const xOffset = Math.ceil($ViewBox[0] / xSpacing) * xSpacing;
		// const xOffset = Math.ceil($ViewBox[0]);
		// console.log("xOffset", xOffset, "xCount", xCount);
		xs = Array.from(Array(xCount + 1))
			.map((_, i) => xOffset + xSpacing * i);
	}
	$: {
		let ySpacing = 1;
		while (($ViewBox[3] / ySpacing) > 32) { ySpacing *= 2; }
		const yCount = parseInt($ViewBox[3] / ySpacing);
		const yOffset = Math.ceil($ViewBox[1] / ySpacing) * ySpacing;
		ys = Array.from(Array(yCount + 1))
			.map((_, i) => yOffset + ySpacing * i);
	}
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
			y1={$ViewBox[1]}
			x2={x}
			y2={$ViewBox[1] + $ViewBox[3]}
		/>
	{/each}
	{#each ys as y}
		<line
			x1={$ViewBox[0]}
			y1={y}
			x2={$ViewBox[0] + $ViewBox[2]}
			y2={y}
		/>
	{/each}

	<!--
	stroke-width={$ViewBox[2] * 0.001 + factors[0][x] * 0.02}
	stroke-width={$ViewBox[2] * 0.001 + factors[0][y] * 0.02}
	-->

</g>
