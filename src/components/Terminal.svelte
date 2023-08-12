<script>
	import {
		afterUpdate,
		onMount,
	} from "svelte";
	import {
		Textarea,
		TextareaValue,
	} from "../stores/Terminal.js";
	import { TerminalHistory } from "../stores/History.js";

	let pre;

	afterUpdate(() => { pre.scrollTop = pre.scrollHeight; });
	onMount(() => $Textarea.focus());

	const fade = 2;
	let opacities;
	$: opacities = ($TerminalHistory)
		.map((_, i, arr) => arr.length - 1 - i)
		.map(count => Math.min(fade, count))
		.map(count => 1 - ((count / fade) * 0.5));
</script>

<div>
	<pre bind:this={pre}>{#each $TerminalHistory as line, i}<span style={`opacity: ${opacities[i]}`}>{line.func.name}({line.args ? line.args.map(arg => JSON.stringify(arg)).join(", ") : ""})</span><br/>{/each}</pre>
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
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	pre {
		flex: 1 1 auto;
		overflow-y: scroll;
		font-family: monospace;
	}
	pre > * { margin: 0.1rem 0 }
	textarea {
		flex: 0 0 1.5rem;
		resize: none;
		border: 1px solid transparent;
		color: #ddd;
		outline-color: transparent;
		background-color: #2a2a2a;
	}
	textarea:focus {
		outline: none !important;
		border: 1px solid #17c;
		outline-color: transparent;
		background-color: #222;
	}
</style>
