<script>
	export let highlight = false;
</script>

	<button on:click {highlight} >
		<slot />
	</button>

<style>
	button {
		all: unset;
		cursor: pointer;
		flex: 0 0 auto;
		width: 5rem;
		height: 5rem;
		background-color: #2f2f2f;
		border: 2px solid transparent;
		border-radius: 4px;
	}
	button:hover {
		border-color: #fb48;
	}
	button[highlight=true] {
		border-color: #fb4;
	}
</style>