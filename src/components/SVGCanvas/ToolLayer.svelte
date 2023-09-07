<script>
// Anything that is specific to a certain tool?
	import { ViewBox } from "../../stores/ViewBox.js";
	import { ToolNew } from "../../stores/Tool.js";
	import {
		Presses,
		Moves,
		Releases,
	} from "../../stores/UI.js";

	let scribblePointString = "";
	// $: scribblePointString = $ToolNew.name === TOOL_SCRIBBLE
	// 	? [].concat($Presses)
	// 		.concat($Moves)
	// 		.concat($Releases)
	// 		.map(p => p.join(","))
	// 		.join(" ")
	// 	: "";

	let vmax;
	$: vmax = Math.max($ViewBox[2], $ViewBox[3]);

	let tick = 0
	setInterval(() => { tick += (vmax * 0.002); }, 30);
</script>

{#if scribblePointString !== ""}
	<polyline
		class="scribble-line"
		points={scribblePointString}
		stroke-dasharray={[vmax * 0.01, vmax * 0.01].join(" ")}
		stroke-dashoffset={tick}
	/>
{/if}

<style>
	.scribble-line {
		fill: none;
		stroke: #fb4;
	}
</style>
