<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import { executeCommand } from "../../kernel/execute.js";

	export let showPanel;

	let scaleFactor = 1;
</script>

<Panel {showPanel}>
	<span slot="title">Scale</span>
	<span slot="body">
		<div class="container">
			<input
				type="number"
				id="scaleValue"
				bind:value={scaleFactor} >
			<label for="scaleValue">scale</label>
			<button on:click={() => executeCommand("scaleUniform", scaleFactor)}>apply</button>
		</div>
	</span>
</Panel>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	input {
		width: 100%;
	}
</style>
