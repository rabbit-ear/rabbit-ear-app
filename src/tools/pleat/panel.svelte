<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import { PleatCount } from "./stores.js";

	export let showPanel;

	let pleatPattern = "MV"
</script>

<Panel {showPanel}>
	<span slot="title">Pleat</span>
	<span slot="body">
		<div class="container">
			<input
				type="text"
				bind:value={$PleatCount} >
		</div>
		<div>
			<input
				type="text"
				bind:value={pleatPattern}>
		</div>
	</span>
</Panel>

<style>
	input[type=text] {
		width: 100%;
	}
	.container {
		display: flex;
		flex-direction: column;
	}
</style>
