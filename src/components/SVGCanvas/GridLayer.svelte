<script>
	import {
		GridType,
		VerticalUp,
	} from "../../stores/App.js";
	import { viewBoxOrigin } from "../../js/matrix.js";
	import {
		makeSquareGrid,
		makeHexGrid,
	} from "../../js/grid.js";

	export let viewport = [0, 0, 1, 1];

	$: origin = viewBoxOrigin(viewport, $VerticalUp);
	$: actualViewport = [
		origin[0],
		origin[1],
		viewport[2],
		viewport[3],
	];
	$: strokeWidth = Math.max(viewport[2], viewport[3]) / 400;
	$: lines = $GridType === "hex"
		? makeHexGrid(actualViewport)
		: makeSquareGrid(actualViewport);
</script>

<g class="grid" stroke-width={strokeWidth}>
	<!-- <rect
		x={actualViewport[0]}
		y={actualViewport[1]}
		width={actualViewport[2]}
		height={actualViewport[3]}
		fill="none"
		stroke="red"
	/> -->

	{#each lines as line}
		<line {...line} />
	{/each}
</g>

<style>
	line { stroke: var(--background-3); }
/*	line { stroke: var(--dim); }*/
</style>
