<script>
	import Panel from "./Panel.svelte";
</script>

<Panel>
	<span slot="title">file</span>
	<span slot="body">
		<input type="text" placeholder="title">
		<input type="text" placeholder="author">
		<textarea placeholder="description"></textarea>
	</span>
</Panel>

<style>
	input[type=text] {
		width: 100%;
	}
	textarea {
		width: 100%;
/*		max-width: 100%;*/
		resize: vertical;
	}
</style>