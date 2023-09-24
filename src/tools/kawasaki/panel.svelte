<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import Assignment from "../../components/PanelParts/Assignment.svelte";
</script>

<!--
as you hover a vertex, describe the vertex.
if it is a degree-N even number, state how there are
only solutions possible for odd numbered degree vertices.
-->

<Panel>
	<span slot="title">kawasaki</span>
	<span slot="body">
		<div class="container">
			<p class="instruction">flat-fold an odd-numbered degree vertex.</p>
		</div>
		<hr />
		<Assignment />
	</span>
</Panel>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	.instruction {
		color: var(--dim);
		font-style: italic;
	}
</style>
