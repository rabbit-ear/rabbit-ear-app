<script>
	export let index = -1;
	export let highlight = false;
</script>

<!-- important, keep this string encapsulated -->
<!-- it needs to be able to be matched elsewhere in the app -->
<button
	class={"button-frame-item"}
	data-frame-index={index}
	on:click
	on:mousedown
	on:mousemove
	on:mouseup
	{highlight} >
	<slot />
</button>

<style>
	button {
		all: unset;
		cursor: pointer;
		flex: 0 0 auto;
		width: 5rem;
		height: 5rem;
		/* margin: 0.5rem 0; */
		border: 2px solid transparent;
		border-radius: 4px;
	}
	button:hover {
		border-color: var(--highlight);
	}
	button[highlight=true] {
		border-color: var(--highlight);
	}
	button:focus {
		outline-offset: -2px;
		outline: 2px solid var(--uiblue);
	}
</style>
