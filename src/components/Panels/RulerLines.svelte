<script>
	import Panel from "./Panel.svelte";
	import {
		RulerLines,
		RulerRays,
		RulerLinePreviews,
		RulerRayPreviews,
	} from "../../stores/Ruler.js";
	// import { RulersAutoClear } from "../../stores/App.js";

	const clearRulers = () => {
		$RulerLines = [];
		$RulerRays = [];
	};
</script>

<Panel>
	<span slot="title">ruler lines</span>
	<span slot="body">
		<p>{$RulerLines.length + $RulerRays.length} currently</p>
		<!-- <div>
			<input type="checkbox" id="auto-clear" bind:checked={$RulersAutoClear}><label for="auto-clear">auto-clear rulers</label>
		</div> -->
		<div>
			<button on:click={clearRulers}>clear rulers</button>
		</div>
		<p>{$RulerLinePreviews.length + $RulerRayPreviews.length} preview lines</p>
	</span>
</Panel>
