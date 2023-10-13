<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import { executeCommand } from "../../kernel/execute.js";
	export let showPanel;
	let x = 0;
	let y = 0;
</script>

<Panel {showPanel}>
	<span slot="title">Translate</span>
	<span slot="body">
		<div class="container">
			<div class="row">
				<label for="translate-x">x</label>
				<input
					type="number"
					id="translate-x"
					bind:value={x} >
			</div>
			<div class="row">
				<label for="translate-y">y</label>
				<input
					type="number"
					id="translate-y"
					bind:value={y} >
			</div>
			<button on:click={() => executeCommand("translate", [x, y])}>apply</button>
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
