<script>
	import Panel from "./Panel.svelte";
	import { GraphHistory } from "../../stores/History.js";
</script>

<Panel>
	<span slot="title">history</span>
	<span slot="body">
		<p>history: <span class="number">{$GraphHistory.length}</span></p>
	</span>
</Panel>

<style>
	.number { font-weight: bold; }
</style>
