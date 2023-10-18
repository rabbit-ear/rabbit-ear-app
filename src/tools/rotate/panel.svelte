<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import { executeCommand } from "../../kernel/execute.js";
	export let showPanel;

	let angle = 0;
	$: radians = angle * (Math.PI / 180);
</script>

<Panel {showPanel}>
	<span slot="title">Rotate</span>
	<span slot="body">
		<div class="container">
			<div class="row">
				<label for="rotate-angle">angle</label>
				<input
					type="number"
					placeholder="degrees"
					id="rotate-angle"
					bind:value={angle} >
			</div>
			<button on:click={() => executeCommand("rotateZ", radians)}>apply</button>
		</div>
	</span>
</Panel>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	.row {
		display: flex;
		flex-direction: row;
	}
	input {
		width: 100%;
		flex: 1 1 auto;
	}
	label {
		flex: 0 1 auto;
		margin-right: 0.5rem;
	}
</style>
