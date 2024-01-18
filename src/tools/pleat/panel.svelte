<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import { Keyboard } from "../../stores/UI.js";
	import {
		PleatCount,
		PleatPattern,
	} from "./stores.js";

	export let showPanel;
</script>

<Panel {showPanel}>
	<span slot="title">Pleat</span>
	<span slot="body">
		<div class="container gap">
			<p>count</p>
			<input
				type="text"
				bind:value={$PleatCount} >
		</div>
		<div class="container gap">
			<p>assignment</p>
			<input
				type="text"
				bind:value={$PleatPattern} >
		</div>
		<div class="container gap">
			<p>sector selector</p>
			<p class={$Keyboard[16] ? "highlight" : "no-highlight"}>shift</p>
		</div>
	</span>
</Panel>

<style>
	input[type=text] {
		width: 100%;
		font-weight: bold;
	}
	.container {
		display: flex;
		flex-direction: column;
	}
	.highlight {
		font-weight: bold;
		color: var(--highlight);
	}
	.no-highlight {
		font-weight: bold;
	}
</style>
