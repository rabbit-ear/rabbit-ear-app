<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import { PleatCount } from "./stores.js";
</script>

<Panel>
	<span slot="title">pleat</span>
	<span slot="body">
		<div class="container">
			<input
				type="text"
				bind:value={$PleatCount} >
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
