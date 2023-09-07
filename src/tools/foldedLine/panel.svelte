<script>
	import Panel from "../../components/Panels/Panel.svelte";
</script>

<Panel>
	<span slot="title">folded line</span>
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
