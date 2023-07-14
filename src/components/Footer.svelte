<script>
	import { afterUpdate } from "svelte";
	import {
		Textarea,
		TextareaValue,
		AppHistory,
	} from "../stores/Terminal.js";

	let pre;

	afterUpdate(() => { pre.scrollTop = pre.scrollHeight; });

	const fade = 2;
	let opacities;
	$: opacities = ($AppHistory)
		.map((_, i, arr) => arr.length - 1 - i)
		.map(count => Math.min(fade, count))
		.map(count => 1 - ((count / fade) * 0.5));
</script>

<div>
	<pre bind:this={pre}>{#each $AppHistory as line, i}<span style={`opacity: ${opacities[i]}`}>{line.func.name}({line.args ? line.args.map(arg => JSON.stringify(arg)).join(", ") : ""})</span><br/>{/each}</pre>
	<textarea
		bind:this={$Textarea}
		bind:value={$TextareaValue}
		autocomplete="off"
		autocorrect="off"
		rows="1"
	/>
</div>

<style>
	div {
		height: 6rem;
		display: flex;
		flex-direction: column;
		background-color: #333;
	}
	pre {
		height: 4rem;
		overflow-y: scroll;
		font-family: monospace;
	}
	pre > * { margin: 0.1rem 0 }
	textarea {
		height: 2rem;
		/* height: 100%; */
		resize: none;
		border: 1px solid transparent;
		color: #ddd;
		outline-color: transparent;
		background-color: transparent;
	}
	textarea:focus {
		outline: none !important;
		border: 1px solid #17c;
		outline-color: transparent;
		background-color: #222;
	}
</style>
