<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import Assignment from "../../components/PanelParts/Assignment.svelte";
</script>

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
