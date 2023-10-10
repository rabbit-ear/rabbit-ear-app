<script>
	export let This;
</script>

<dialog
	on:close
	on:cancel
	bind:this={This}>
	<slot />
</dialog>

<style>
	dialog {
		padding: 0;
		background-color: #282222ee;
		border: 1px solid var(--dim);
		border-radius: 1rem;
		box-shadow: 0 0 1rem black;
	}
	dialog::backdrop {
		background-color: #0004;
	}
	dialog > :global(*) {
		margin: 1rem;
	}
</style>
