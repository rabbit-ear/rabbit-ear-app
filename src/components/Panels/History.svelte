<script>
	import Panel from "./Panel.svelte";
	import { FileHistory } from "../../stores/History.js";
</script>

<Panel>
	<span slot="title">history</span>
	<span slot="body">
		<p>history: <span class="number">{$FileHistory.length}</span></p>
	</span>
</Panel>

<style>
	.number { font-weight: bold; }
</style>
