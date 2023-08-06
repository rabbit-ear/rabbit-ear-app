<script>
	import Panel from "./Panel.svelte";
</script>

<Panel>
	<span slot="title">file</span>
	<span slot="body">
		<h3>title</h3>
		<input type="text">
		<h3>author</h3>
		<input type="text">
		<h3>description</h3>
		<textarea></textarea>
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