<script>
	const loadFiles = (event) => {
		// have to cache the filename here
		// because it's not contained in the event object
		// that gets passed into the async function fileOnLoad
		let filename = "";

		const fileOnLoad = (event) => {
			try {
				const contents = JSON.parse()
				// executeCommand("load", contents, filename);
				// tryLoadFile(event.target.result, filename);
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

	const dragenter = (e) => {
		isHovering = true;
		e.preventDefault();
	};
	const dragleave = (e) => {
		isHovering = false;
		e.preventDefault();
	};
	const dragover = (e) => {
		isHovering = true;
		e.preventDefault();
	};
	const drop = (event) => {
		isHovering = false;
		event.preventDefault();
		event.stopPropagation();
		loadFiles(event);
	};
</script>

<svelte:body
	on:dragenter={dragenter}
	on:dragleave={dragleave}
	on:dragover={dragover}
	on:drop={drop}
/>

{#if isHovering}
	<div class="dragging" />
{/if}

<style>
	div {
		pointer-events: none;
		position: absolute;
		z-index: 5;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
		outline: none;
		border: 3px solid transparent;
	}
	div.dragging {
		border-color: var(--highlight);
	}
</style>
