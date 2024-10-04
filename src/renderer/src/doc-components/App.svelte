<script lang="ts">
	import AppTitle from "./AppTitle.svelte";
	import LoadFile from "./LoadFile.svelte";
	import TextArea from "./TextArea.svelte";
	import DragAndDrop from "./DragAndDrop.svelte";
</script>

<main>
	<AppTitle />
	<DragAndDrop />
	<LoadFile />
	<TextArea />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		min-height: 100vh;
	}
</style>
