<script>
	import Tools from "../tools/index.js";
	import { Tool } from "../stores/UI.js";
	import { FrameIsLocked } from "../stores/Model.js";
	import { executeCommand } from "../kernel/execute.js";

	const tempDisabled = {
		"folded line": true,
		"rabbit ear": true,
		"pleat": true,
		"scribble": true,
	};

	// const categories = Array.from(
	// 	new Set(Object.values(Tools).map(el => el.group))
	// );
	const categories = [
		"general",
		"simple",
		"attributes",
		"many lines",
		"single vertex",
		"transform",
		"undefined"
	];
	const filterAndSort = (tools, category) => {
		const categoryTools = tools
			.filter(el => el.group === category);
		const unorderedTools = categoryTools
			.filter(el => el.order === undefined);
		const orderedTools = categoryTools
			.filter(el => el.order !== undefined)
			.sort((a, b) => a.order - b.order);
		return orderedTools.concat(unorderedTools);
	};

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

{#each categories as category}
	<div class="grid-columns">
		{#each filterAndSort(Object.values(Tools), category) as tool}
			<button
				title={tool.name}
				class={tool.name}
				disabled={$FrameIsLocked || tool.name in tempDisabled}
				highlighted={$Tool && $Tool.name === tool.name}
				on:click={() => executeCommand("setTool", tool.key)}>
				{#if tool.icon}
					<svelte:component this={tool.icon} />
				{/if}
			</button>
		{/each}
	</div>
	<hr />
{/each}

				<!-- on:click={() => Tool.set(tool)} -->

<style>
	/*label {
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
	}*/

	/* button grid layout */
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
		cursor: pointer;
		background-color: transparent;
	}
	/* :global(svg) */
	button {
		stroke: var(--text);
		fill: var(--text);
	}
	button:hover {
		stroke: var(--bright);
		fill: var(--bright);
	}
	button[highlighted="true"] {
		background-color: var(--highlight);
		stroke: var(--background-1);
		fill: var(--background-1);
	}
	button[disabled], button[disabled]:hover {
		background-color: transparent;
		stroke: var(--dim);
		fill: var(--dim);
		cursor: initial;
	}
	button:focus {
		outline-offset: -1px;
		outline: 2px solid var(--uiblue);
	}
</style>
