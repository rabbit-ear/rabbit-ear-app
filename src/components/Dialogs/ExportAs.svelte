<script>
	import Dialog from "./Dialog.svelte";
	import { DialogExportAs } from "../../stores/App.js";
</script>

<Dialog bind:This={$DialogExportAs}>
	<h1>Export to File</h1>
	<div></div>
</Dialog>

<style>
</style>
