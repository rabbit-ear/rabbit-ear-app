<script>
	export let index = 0;
	export let names = [];
</script>

<div class="body">
	{#if index === 0}
		<slot name="0" />
	{/if}
	{#if index === 1}
		<slot name="1" />
	{/if}
	{#if index === 2}
		<slot name="2" />
	{/if}
	{#if index === 3}
		<slot name="3" />
	{/if}
	{#if index === 4}
		<slot name="4" />
	{/if}
</div>

<div class="tab-bar">
	{#each names as name, i}
		<button on:click={() => index = i}>{name}</button>
	{/each}
</div>

<style>
	button {
		width: 100%;
		font-weight: bold;
		color: var(--text);
		font-size: 1rem;
/*		height: 3rem;*/
		border: none;
		background-color: transparent; /*var(--background-1);*/
	}
	button:hover {
		color: var(--highlight);
	}
	.tab-bar {
		display: flex;
		flex-direction: row;
		align-items: space-evenly;
		padding: 0;
		gap: 2px;
	}
</style>
