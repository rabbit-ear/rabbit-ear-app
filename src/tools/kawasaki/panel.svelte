<script>
	import Panel from "../../components/Panels/Panel.svelte";
</script>

<Panel>
	<span slot="title">kawasaki</span>
	<span slot="body">
		<div class="container">
			<p class="instruction">fix a vertex with an odd-number of edges.</p>
		</div>
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
