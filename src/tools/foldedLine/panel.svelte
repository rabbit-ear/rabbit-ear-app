<script>
	import Panel from "../../components/Panels/Panel.svelte";

	export let showPanel;
</script>

<Panel {showPanel}>
	<span slot="title">Folded Line</span>
	<span slot="body">
		<div class="container">
		</div>
	</span>
</Panel>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
</style>
