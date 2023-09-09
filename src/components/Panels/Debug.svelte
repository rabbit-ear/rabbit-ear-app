<script>
	import Panel from "./Panel.svelte";
	import {
		ExecuteInput,
		ExecuteUIInput,
	} from "../../stores/Debug.js";
</script>

<Panel>
	<span slot="title">debug</span>
	<span slot="body">
		<p>Execute</p>
		<p>{$ExecuteInput}</p>
		<hr/>
		<p>Execute (UI)</p>
		<p>{$ExecuteUIInput}</p>
	</span>
</Panel>

<style>
	.value { font-weight: bold; }
</style>
