<script>
	import { ViewBox } from "../../stores/ViewBox.js";
	import {
		Presses,
		Moves,
		Releases,
	} from "./stores.js";

	let scribblePointString = "";
	$: scribblePointString = []
		.concat($Presses)
		.concat($Moves)
		.concat($Releases)
		.map(p => p.join(","))
		.join(" ")

	let vmax;
	$: vmax = Math.max($ViewBox[2], $ViewBox[3]);

	let tick = 0
	setInterval(() => { tick += (vmax * 0.002); }, 30);
</script>

{#if scribblePointString !== ""}
	<polyline
		points={scribblePointString}
		stroke-dasharray={[vmax * 0.01, vmax * 0.01].join(" ")}
		stroke-dashoffset={tick}
	/>
{/if}

<style>
	polyline {
		fill: none;
		stroke: #fb4;
	}
</style>
