<script>
	let expanded = true;
</script>

<div class="container">
	<button class="title" on:click={() => expanded = !expanded}>
		<slot name="title">
			<span class="missing">Panel</span>
		</slot>
	</button>

	{#if expanded}
		<div class="body">
			<slot name="body" />
		</div>
	{/if}
</div>

<style>
	.container {
		margin: 0.5rem;
	}
	button {
		all: unset;
		box-sizing: border-box;
		width: 100%;
		cursor: pointer;
	}
	.title {
		padding: 0.25rem 0.5rem;
		color: white;
		background-color: var(--uiblue);
		font-weight: bold;
	}
	.title:hover {
		background-color: var(--uidarkblue);
	}
	.body {
		padding: 0.25rem 0.5rem;
		background-color: var(--background-2);
	}
</style>
