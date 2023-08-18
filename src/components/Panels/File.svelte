<script>
	import {
		File,
		FrameIndex,
		Frames,
	} from "../../stores/Model.js";
	import Panel from "./Panel.svelte";
	// let cpOrFolded = "crease-pattern";
</script>

<Panel>
	<span slot="title">file</span>
	<span slot="body">
		<input type="text" placeholder="title" bind:value={$File.file_title} >
		<input type="text" placeholder="author" bind:value={$File.file_author} >
		<textarea placeholder="description" bind:value={$File.file_description}></textarea>
		<h3>frame {$FrameIndex + 1}/{$Frames.length}</h3>
		<!-- <input
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
		resize: vertical;
	}
	strong {
		font-weight: bold;
	}
</style>