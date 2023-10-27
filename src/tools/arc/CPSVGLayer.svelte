<script>
	import { VertexRadiusCP } from "../../stores/Style.js";
	import {
		CPCircle,
		CPMoveCoords,
		CPDragCoords,
		// CPCoords0,
		// CPCoords1,
		// CPSegment0,
		// CPSegment1,
	} from "./stores.js";

	$: points = [
		$CPMoveCoords, 
		$CPDragCoords
		// $CPCoords0, 
		// $CPCoords1, 
		// $CPSegment0, 
		// $CPSegment1, 
	].filter(a => a !== undefined);
</script>

{#each points as point}
	<circle
		class="cursor"
		r={$VertexRadiusCP * 1.5}
		cx={point[0]}
		cy={point[1]} />
{/each}

{#if $CPCircle !== undefined}
	<circle
		class="arc-ruler"
		cx={$CPCircle.center[0]}
		cy={$CPCircle.center[1]}
		r={$CPCircle.radius}
	/>
{/if}

<style>
	circle.cursor {
		stroke: none;
		fill: var(--highlight);
	}
	circle.arc-ruler {
		stroke: var(--highlight);
		fill: none;
	}
</style>
