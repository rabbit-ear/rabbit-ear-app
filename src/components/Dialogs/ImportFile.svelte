<script>
	import Dialog from "./Dialog.svelte";
	import ImportSVG from "./ImportSVG.svelte";
	import ImportOPX from "./ImportOPX.svelte";
	import ImportOBJ from "./ImportOBJ.svelte";
	import { DialogImportFile } from "../../stores/App.js";
	import {
		ImportFileMetadata,
		finishImport,
	} from "../../stores/File.js";

	const cancel = () => $DialogImportFile.close();

	const didClose = () => {
		ImportFileMetadata.set({});
	};

	const confirm = () => {
		finishImport();
		$DialogImportFile.close();
		ImportFileMetadata.set({});
	};
</script>

<Dialog
	on:close={didClose}
	on:cancel={didClose}
	bind:This={$DialogImportFile}>
	{#if $ImportFileMetadata && $ImportFileMetadata.extension === "svg"}
		<ImportSVG />
	{:else if $ImportFileMetadata && $ImportFileMetadata.extension === "opx"}
		<ImportOPX />
	{:else if $ImportFileMetadata && $ImportFileMetadata.extension === "obj"}
		<ImportOBJ />
	{:else}
		<p>unknown file type</p>
	{/if}

	<div class="flex-row gap right">
		<button on:click={confirm}>import</button>
		<button on:click={cancel}>cancel</button>
	</div>
</Dialog>

<style>
	.flex-row {
		display:flex;
		flex-direction: row;
	}
	.gap {
		gap: 0.5rem;
	}
	.right {
		justify-content: flex-end;
	}
</style>
