<script>
	import { VertexRadiusCP } from "../../stores/Style.js";
	import {
		CPMoveCoords,
		CPPressCoords,
		CPDragCoords,
	} from "./stores.js";

	let points = [];
	$: points = [$CPMoveCoords, $CPPressCoords, $CPDragCoords]
		.filter(a => a !== undefined);
</script>

{#each points as point}
	<circle
		r={$VertexRadiusCP * 1.5}
		cx={point[0]}
		cy={point[1]} />
{/each}

{#if $CPDragCoords !== undefined && $CPPressCoords !== undefined}
	<line
		x1={$CPPressCoords[0]}
		y1={$CPPressCoords[1]}
		x2={$CPDragCoords[0]}
		y2={$CPDragCoords[1]} />
{/if}

<style>
	circle {
		stroke: none;
		fill: var(--highlight);
	}
	line {
		stroke: var(--highlight);
	}
</style>
