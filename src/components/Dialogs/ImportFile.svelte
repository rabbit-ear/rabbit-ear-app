<script>
	import Dialog from "./Dialog.svelte";
	import ImportSVG from "./ImportSVG.svelte";
	import ImportOPX from "./ImportOPX.svelte";
	import { DialogImportFile } from "../../stores/App.js";
	import {
		ImportFileMetadata,
		finishImport,
	} from "../../stores/File.js";

	const cancel = () => $DialogImportFile.close();
	const confirm = () => {
		finishImport();
		$DialogImportFile.close()
	}
</script>

<Dialog bind:This={$DialogImportFile}>

	{#if $ImportFileMetadata && $ImportFileMetadata.extension === "svg"}
		<ImportSVG />
	{:else if $ImportFileMetadata && $ImportFileMetadata.extension === "opx"}
		<ImportOPX />
	{:else}
		<p>unknown file type</p>
	{/if}

	<div class="flex-row">
		<button on:click={cancel}>cancel</button>
		<button on:click={confirm}>import</button>
	</div>
</Dialog>

<style>
	.flex-row {
		display:flex;
		flex-direction: row;
	}
</style>
