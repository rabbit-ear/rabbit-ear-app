<script>
	import MenuItem from "./MenuItem.svelte";

	export let submenu;
	export let level = 0;
</script>

<ul class={`level-${level}`}>
	{#each submenu as item}
		<li class={`level-${level}`}>
			{#if item.submenu}
				{item.label}
				<svelte:self submenu={item.submenu} level={level + 1}/>
			{:else}
				<MenuItem {item} />
			{/if}
		</li>
	{/each}
</ul>

<style>
	ul {
		background-color: var(--background-2);
		color: var(--text);
		/* all ul besides the top level */
		display: none;
		position: absolute;
		z-index: 3;
		box-shadow: 0 calc(1rem * 0.5) 1rem 0 black;
		top: 0;
	}
	ul.level-0 {
		/* unset the behavior of nested uls */
		height: 100%;
		display: block;
		position: static;
		z-index: initial;
		box-shadow: none;
		top: initial;
	}
	ul.level-1 { top: calc(2rem - 3px); }
	ul.level-2 { left: calc(3rem); }
	ul.level-3 { left: calc(6rem); }
	ul.level-4 { left: calc(9rem); }

	li {
		user-select: none;
		height: 100%;
		font-weight: normal;
		padding: 0.25rem 1rem;
		position: relative;
	}
	li.level-0 {
		font-weight: bold;
		padding: 0 1rem;
		display: inline-flex;
		align-items: center;
		position: static;
	}
	li:hover {
		background-color: var(--background-3);
		color: var(--bright);
	}

	/*nav li[highlighted=true] {
		background-color: #e53;
		color: var(--highlight);
	}*/
	/*nav li[highlighted=true]:hover {
		background-color: #f75;
	}*/

	/*li.no-select {
		background-color: unset;
		color: unset;
	}
	li.no-select:hover {
		background-color: unset;
	}
	li.description {
		font-style: italic;
		opacity: 80%;
	}*/

	:global(nav li:hover > ul) {
		display: block;
	}
</style>
