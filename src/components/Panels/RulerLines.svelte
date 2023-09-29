<script>
	import Panel from "./Panel.svelte";
	import {
		RulerLines,
		RulerRays,
	} from "../../stores/Ruler.js";
	import {
		UILines,
		UIRays,
	} from "../../stores/UI.js";

	const clearRulers = () => {
		$RulerLines = [];
		$RulerRays = [];
	};
</script>

<Panel>
	<span slot="title">ruler lines</span>
	<span slot="body">
		<p>{$RulerLines.length + $RulerRays.length} currently</p>
		<div>
			<button on:click={clearRulers}>clear rulers</button>
		</div>
		<p>{$UILines.length + $UIRays.length} preview lines</p>
	</span>
</Panel>
