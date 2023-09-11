<script>
	import { loadFileDialog } from "../../js/file.js";
	import { InputFile } from "../../stores/App.js";
	import template from "./template.js";
	import MenuList from "./MenuList.svelte";
</script>

	<nav>
		<MenuList submenu={template} />
	</nav>

	<input
		type="file"
		id="file"
		bind:this={$InputFile}
		on:change={loadFileDialog} />

<style>
	nav {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100%;
		box-shadow: 0 0rem 0.25rem 0 black;
		position: relative;
		z-index: 1;
	}
	input[type=file] {
		display: none;
		/* visibility: hidden; */
	}
	/* colors */
	nav {
		background-color: var(--background-2);
		color: var(--text);
	}
</style>
