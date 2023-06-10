<script>
	import { afterUpdate } from "svelte";
	import { onKeyDown } from "../stores/ui.js";
	import { history } from "../stores/app.js";

	let preRef;
	let textareaValue = "";

	export const keydown = (e) => {
		e.preventDefault();
		onKeyDown(e);
		switch (e.keyCode) {
		case 13: textareaValue = ""; break;
		default: break;
		}
	};

	afterUpdate(() => { preRef.scrollTop = preRef.scrollHeight; });

	const fade = 2;
	let opacities;
	$: opacities = $history
		.map((_, i, arr) => arr.length - 1 - i)
		.map(count => Math.min(fade, count))
		.map(count => 1 - ((count / fade) * 0.5));
</script>

<div>
	<pre bind:this={preRef}>{#each $history as line, i}<span style={`opacity: ${opacities[i]}`}>{line.func.name}({line.args ? line.args.map(arg => JSON.stringify(arg)).join(", ") : ""})</span><br/>{/each}</pre>
	<textarea
		bind:value={textareaValue}
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
