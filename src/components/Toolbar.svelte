<script>
	import Tools from "../tools/index.js";
	import {
		SELECT_VERTEX,
		SELECT_EDGE,
		SELECT_FACE,
	} from "../app/keys.js";
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
</style>
