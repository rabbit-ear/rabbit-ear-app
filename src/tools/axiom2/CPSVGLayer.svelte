<script>
	import { VertexRadiusCP } from "../../stores/Style.js";
	import {
		CPMoveCoords,
		CPDragCoords,
		CPCoords0,
		CPCoords1,
		CPSegment0,
		CPSegment1,
	} from "./stores.js";

	$: points = [
		$CPCoords0, 
		$CPCoords1, 
		$CPSegment0, 
		$CPSegment1, 
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

{#if $CPSegment0 !== undefined && $CPDragCoords !== undefined}
	<line
		x1={$CPSegment0[0]}
		y1={$CPSegment0[1]}
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
