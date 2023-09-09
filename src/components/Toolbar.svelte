<script>
	import Tools from "../tools/index.js";
	import { Tool } from "../stores/UI.js";
	import { FrameIsLocked } from "../stores/Model.js";

	// const categories = Array.from(
	// 	new Set(Object.values(Tools).map(el => el.group))
	// );
	const categories = [
		"general",
		"simple",
		"attributes",
		"lines",
		"many lines",
		"single vertex",
		"transform",
	];
</script>

<!-- 
{#each categories as category}
	<p>{category}</p>
	<div class="vertical-radio">
		{#each Object.values(Tools).filter(el => el.group === category) as tool}
			<input
				type="radio"
				name="tool"
				id={`${tool}-${tool.name}`}
				disabled={$FrameIsLocked}
				bind:group={$Tool}
				value={tool} />
			<label for={`${tool}-${tool.name}`}>{tool.name}</label>
		{/each}
	</div>
{/each}
 -->

<div class="toolbar">
	{#each categories as category}
		<div class="grid-columns">
			{#each Object.values(Tools).filter(el => el.group === category) as tool}
				<button
					title={tool.name}
					class={tool.name}
					disabled={$FrameIsLocked}
					highlighted={$Tool && $Tool.name === tool.name}
					on:click={() => Tool.set(tool)}>
					{#if tool.icon}
						<svelte:component this={tool.icon} />
					{/if}
				</button>
			{/each}
		</div>
		<hr />
	{/each}
</div>

<style>
	label {
		user-select: none;
	}
	p {
		color: var(--text);
		margin: 1rem 0 0.25rem 0;
		font-style: italic;
		user-select: none;
	}
	p:first-of-type { margin-top: 0; }
	.vertical-radio {
		display: grid;
		grid-template-columns: min-content 1fr;
	}
	.vertical-radio input {
		grid-column: 1;
	}

	/* button grid layout */
	.toolbar {
		height: 100%;
		overflow-y: auto;
	}
	.grid-columns {
		display: grid;
		grid-template-columns: 50% 50%;
		align-content: flex-start;
	}
	button {
		width: 2rem;
		height: 2rem;
		display: inline-block;
		margin: 0.15rem;
		padding: 0;
		border: 0px solid;
		border-radius: 0.25rem;
		outline-offset: 0.125rem;
		cursor: pointer;
/*		background-color: var(--toolbar-button-color);*/
	}
	/* :global(svg) */
	button {
		stroke: var(--text);
		fill: var(--text);
	}
	button:hover {
/*		background-color: var(--toolbar-button-hover);*/
		stroke: var(--bright);
		fill: var(--bright);
	}
	button[highlighted="true"] {
		stroke: var(--highlight);
		fill: var(--highlight);
	}
	hr {
		margin: 1.5px;
		border: 1.5px solid var(--dim);
		opacity: 0.5;
	}
</style>
