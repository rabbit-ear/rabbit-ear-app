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
		<div class="flex-column">
			<p>Execute</p>
			<p>{$ExecuteInput}</p>
			<hr/>
			<p>Execute (UI)</p>
			<p>{$ExecuteUIInput}</p>
		</div>
	</span>
</Panel>

<style>
	div {
		overflow: hidden;
	}
</style>
