<script>
	export let highlight = false;
</script>

	<!-- important, keep this string encapsulated -->
	<!-- it needs to be able to be matched elsewhere in the app -->
	<button class={"button-frame-item"} on:click {highlight} >
		<slot />
	</button>

<style>
	button {
		all: unset;
		cursor: pointer;
		flex: 0 0 auto;
		width: 5rem;
		height: 5rem;
		background-color: var(--background-0);
		border: 2px solid transparent;
		border-radius: 4px;
	}
	button:hover {
		border-color: var(--highlight);
	}
	button[highlight=true] {
		border-color: var(--highlight);
	}
</style>