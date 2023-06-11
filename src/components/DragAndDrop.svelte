<script>
	import { onMount, onDestroy } from "svelte";
	import { tryLoadFile } from "../js/file.js";

	const loadFiles = (event) => {
		// drag and drop file event is weird.
		// have to cache the filename here
		// because it's not contained in the event object
		// that gets passed into the async function fileOnLoad
		let filename = "";

		const fileOnLoad = (event) => {
			try {
				tryLoadFile(event.target.result, filename);
			} catch (error) {
				window.alert(error);
			}
		};

		if (event.dataTransfer.items) {
			const filenames = [...event.dataTransfer.files]
				.map(el => el.name);
			const transferFile = [...event.dataTransfer.items]
				.map((item, i) => ({ item, filename: filenames[i] }))
				.filter(el => el.item.kind === "file")
				.map(el => ({ ...el, contents: el.item.getAsFile() }))
				.shift();
			if (transferFile) {
				const reader = new FileReader();
				reader.onload = fileOnLoad;
				filename = transferFile.filename;
				reader.readAsText(transferFile.contents);
				return reader;
			}
		}
	};

	let isHovering = false;

	const dragenter = (e) => { isHovering = true; e.preventDefault(); };
	const dragleave = (e) => { isHovering = false; e.preventDefault(); };
	const dragover = (e) => { isHovering = true; e.preventDefault(); };
	const drop = (event) => {
		isHovering = false;
		event.preventDefault();
		event.stopPropagation();
		loadFiles(event);
	}

	onMount(() => {
		document.body.addEventListener("dragenter", dragenter, false);
		document.body.addEventListener("dragleave", dragleave, false);
		document.body.addEventListener("dragover", dragover, false);
		document.body.addEventListener("drop", drop, false);
	});

	onDestroy(() => {
		document.body.removeEventListener("dragenter", dragenter, false);
		document.body.removeEventListener("dragleave", dragleave, false);
		document.body.removeEventListener("dragover", dragover, false);
		document.body.removeEventListener("drop", drop, false);
	});
</script>

	{#if isHovering}
		<div class="dragging" />
	{/if}

<style>
	div {
		pointer-events: none;
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
		outline: none;
		border: 3px solid transparent;
    border-radius: 0.25rem;
	}
	div.dragging {
		border-color: #fb4;
	}
</style>
