<script>
	import Dialog from "./Dialog.svelte";
	import { DialogExportAs } from "../../stores/App.js";
	import {
		CurrentFrameToSVG,
		CurrentFrameToPNG,
		CurrentFrameToJPG,
		FramesToSVGs,
		FramesToPNGs,
		FramesToJPGs,
	} from "../../stores/File.js";
	import {
		writeTextFile,
		writeTextFiles,
		writeBinaryFile,
		writeBinaryFiles,
	} from "../../js/file.js";

	let format = "svg";
	let allFrames = true;

	const cancel = () => $DialogExportAs.close();
	const confirm = () => {
		if (!allFrames) {
			switch (format) {
			case "svg": writeTextFile(CurrentFrameToSVG(), "svg"); break;
			case "png": writeBinaryFile(CurrentFrameToPNG(), "png"); break;
			case "jpg": writeBinaryFile(CurrentFrameToJPG(), "jpg"); break;
			default: break;
			}
		} else {
			switch (format) {
			case "svg": writeTextFiles(FramesToSVGs(), "svg"); break;
			case "png": writeBinaryFiles(FramesToPNGs(), "png"); break;
			case "jpg": writeBinaryFiles(FramesToJPGs(), "jpg"); break;
			default: break;
			}
		}
		$DialogExportAs.close();
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
				disabled={true}
				bind:group={format}
				value="png">
			<label for="exportFormatPNG">png</label>
		</div>
		<div>
			<input
				type="radio"
				name="exportFormat"
				id="exportFormatJPG"
				disabled={true}
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
