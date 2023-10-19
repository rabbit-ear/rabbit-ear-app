<script>
	import { VertexRadiusCP } from "../../stores/Style.js";
	import {
		InputPoint0,
		InputPoint1,
		Segment0,
		Segment1,
	} from "./stores.js";

	let points = [];
	$: points = [$InputPoint0, $InputPoint1, $Segment0, $Segment1]
		.filter(a => a !== undefined);
</script>

{#each points as point}
	<circle
		r={$VertexRadiusCP * 1.5}
		cx={point[0]}
		cy={point[1]} />
{/each}

{#if $Segment0 !== undefined && $Segment1 !== undefined}
	<line
		x1={$Segment0[0]}
		y1={$Segment0[1]}
		x2={$Segment1[0]}
		y2={$Segment1[1]} />
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
