<script>
	import Dialog from "./Dialog.svelte";
	import { DialogExportAs } from "../../stores/App.js";
	import {
		FramesToSVGs,
		FramesToPNGs,
		FramesToJPGs,
		WriteSVGFiles,
	} from "../../stores/Convert.js";

	let format = "svg";
	let allFrames = true;

	const cancel = () => $DialogExportAs.close();
	const confirm = () => {
		switch (format) {
		case "svg": break;
		case "png": break;
		case "jpg": break;
		}
		WriteSVGFiles(FramesToSVGs());
	};
</script>

<Dialog bind:This={$DialogExportAs}>
	<h1>Export to File</h1>
	<div class="flex-column">
		<div>
			<input
				type="radio"
				name="exportFormat"
				id="exportFormatSVG"
				bind:group={format}
				value="svg">
			<label for="exportFormatSVG">svg</label>
		</div>
		<div>
			<input
				type="radio"
				name="exportFormat"
				id="exportFormatPNG"
				bind:group={format}
				value="png">
			<label for="exportFormatPNG">png</label>
		</div>
		<div>
			<input
				type="radio"
				name="exportFormat"
				id="exportFormatJPG"
				bind:group={format}
				value="jpg">
			<label for="exportFormatJPG">jpg</label>
		</div>
	</div>
	<div class="flex-row">
		<input type="checkbox" id="all-frames" bind:checked={allFrames}>
		<label for="all-frames">export all frames</label>
	</div>
	<div class="flex-row">
		<button on:click={cancel}>Cancel</button>
		<button on:click={confirm}>Export</button>
	</div>
</Dialog>

<style>
	.flex-row {
		display: flex;
		flex-direction: row;
	}
	.flex-column {
		display: flex;
		flex-direction: column;
	}
</style>
