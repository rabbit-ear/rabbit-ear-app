<script>
	import { File } from "../../stores/Model.js";
	import Panel from "./Panel.svelte";

	const file_classes = [
		"singleModel",
		"multiModel",
		"animation",
		"diagrams",
	];
</script>

<Panel>
	<span slot="title">file</span>
	<span slot="body">
		<input type="text" placeholder="title" bind:value={$File.file_title} >
		<input type="text" placeholder="author" bind:value={$File.file_author} >
		<textarea placeholder="description" bind:value={$File.file_description}></textarea>
		<p>file class</p>
	</span>
</Panel>

<style>
	input[type=text] {
		width: 100%;
	}
	textarea {
		width: 100%;
		resize: vertical;
	}
</style>
