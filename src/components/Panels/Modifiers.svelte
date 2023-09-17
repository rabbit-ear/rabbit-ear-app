<script>
	import {
		Modifiers,
	} from "../../stores/Modifiers.js";
	import Panel from "./Panel.svelte";

</script>

<Panel>
	<span slot="title">modifiers</span>
	<span slot="body">
		{#each $Modifiers as modifier}
			<hr />
			<input type="checkbox" checked id={`mod-check-${modifier.name}`}>
			<label for={`mod-check-${modifier.name}`}>{modifier.name}</label>
		{/each}
	</span>
</Panel>
