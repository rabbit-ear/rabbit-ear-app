<script>
	export let item;

	let store;
	$: store = item ? item.bind : undefined
</script>

{#if item.type === "separator"}
	<hr />
{:else if item.type === "checkbox" || item.bind}
	{#if item.toolTip}
		<input type="checkbox" id={`${item.label}`} bind:checked={$store} title={item.toolTip}>
		<label for={`${item.label}`} title={item.toolTip}>{item.label}</label>
	{:else}
		<input type="checkbox" id={`${item.label}`} bind:checked={$store} >
		<label for={`${item.label}`}>{item.label}</label>
	{/if}
{:else if item.click}
	{#if item.toolTip}
		<button on:click={item.click} title={item.toolTip}>{item.label}</button>
	{:else}
		<button on:click={item.click}>{item.label}</button>
	{/if}
{:else}
	<span class="no-select description">{item.label}</span>
{/if}

<style>
	hr {
		margin: 0.25rem auto;
		width: 90%;
	}
	button {
		all: unset;
		margin: 0;
		padding: 0;
		border: 0;
	}
	label {
		user-select: none;
	}
	.description {
		/* color: var(--dim);*/
		font-style: italic;
	}
</style>
