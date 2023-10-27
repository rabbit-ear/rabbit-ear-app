<script>
	import { VertexRadiusCP } from "../../stores/Style.js";
	import {
		CPMoveCoords,
		CPDragCoords,
		CPPress0Coords,
		CPRelease0Coords,
		CPPress1Coords,
		CPRelease1Coords,
	} from "./stores.js";

	$: points = [
		$CPPress0Coords, 
		$CPRelease0Coords, 
		$CPPress1Coords, 
		$CPRelease1Coords, 
		$CPMoveCoords, 
		$CPDragCoords
	].filter(a => a !== undefined);
</script>

{#each points as point}
	<circle
		r={$VertexRadiusCP * 1.5}
		cx={point[0]}
		cy={point[1]} />
{/each}

{#if $CPPress1Coords !== undefined && $CPDragCoords !== undefined}
	<line
		x1={$CPPress1Coords[0]}
		y1={$CPPress1Coords[1]}
		x2={$CPDragCoords[0]}
		y2={$CPDragCoords[1]}
		stroke-width={$VertexRadiusCP * 1.5} />
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
