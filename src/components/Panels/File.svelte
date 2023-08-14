<script>
	import { File } from "../../stores/Model.js";
	import Panel from "./Panel.svelte";
	// let cpOrFolded = "crease-pattern";

	let file_title;
	let file_author;
	let file_description;

	$: file_title = $File.file_title ? $File.file_title : "";
	$: file_author = $File.file_author ? $File.file_author : "";
	$: file_description = $File.file_description ? $File.file_description : "";
</script>

<Panel>
	<span slot="title">file</span>
	<span slot="body">
		<input type="text" placeholder="title" bind:value={file_title} >
		<input type="text" placeholder="author" bind:value={file_author} >
		<textarea placeholder="description" bind:value={file_description}></textarea>
		<!-- <hr />
		<h3>frame</h3>
		<input
			type="radio"
			name="frame-class"
			id="crease-pattern"
			bind:group={cpOrFolded}
			value="crease-pattern" />
		<label for="crease-pattern">cp</label>
		<input
			type="radio"
			name="frame-class"
			id="folded-form"
			bind:group={cpOrFolded}
			value="folded-form" />
		<label for="folded-form">folded</label> -->
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