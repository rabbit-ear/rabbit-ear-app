<script>
	import { VertexRadius } from "../../stores/App.js";
	import {
		MoveCoords,
		PressCoords,
		DragCoords,
	} from "./stores.js";

	let points = [];
	$: points = [$MoveCoords, $PressCoords, $DragCoords]
		.filter(a => a !== undefined);
</script>

{#each points as point}
	<circle
		r={$VertexRadius * 1.5}
		cx={point[0]}
		cy={point[1]} />
{/each}

<style>
	circle {
		stroke: none;
		fill: var(--highlight);
	}
</style>
