<script>
	import Panel from "./Panel.svelte";
	import { Rulers } from "../../stores/Ruler.js";
	// import { RulersAutoClear } from "../../stores/App.js";

	const clearRulers = () => $Rulers = [];
</script>

<Panel>
	<span slot="title">ruler lines</span>
	<span slot="body">
		<p>{$Rulers.length} currently</p>
		<!-- <div>
			<input type="checkbox" id="auto-clear" bind:checked={$RulersAutoClear}><label for="auto-clear">auto-clear rulers</label>
		</div> -->
		<div>
			<button on:click={clearRulers}>clear rulers</button>
		</div>
	</span>
</Panel>
