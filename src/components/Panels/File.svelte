<script>
	import { FileMetadata } from "../../stores/Model.js";
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
		<input type="text" placeholder="title" bind:value={$FileMetadata.file_title} >
		<input type="text" placeholder="author" bind:value={$FileMetadata.file_author} >
		<textarea placeholder="description" bind:value={$FileMetadata.file_description}></textarea>
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
