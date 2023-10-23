<script>
	import { loadFileDialog } from "../../js/browser.js";
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
		background-color: var(--background-2);
		color: var(--text);
	}
	/* unclear if setting display or visibility is the best way */
	/* to hide the file input for compatibility across all browsers. */
	/* I think: display */
	input[type=file] {
		display: none;
		/* visibility: hidden; */
	}
</style>
