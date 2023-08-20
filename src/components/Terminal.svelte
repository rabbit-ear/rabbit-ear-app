<script>
	import {
		afterUpdate,
		onMount,
	} from "svelte";
	import {
		TerminalTextarea,
		TerminalValue,
	} from "../stores/App.js";
	import { ShowTerminal } from "../stores/App.js";
	import { TerminalHistory } from "../stores/History.js";

	let pre;
	afterUpdate(() => { pre.scrollTop = pre.scrollHeight; });
	// onMount(() => $TerminalTextarea.focus());
	$: {
		$ShowTerminal;
		if ($TerminalTextarea) $TerminalTextarea.focus();
	};
</script>

{#if $ShowTerminal}
	<div class="expanded">
		<pre bind:this={pre}>{#each $TerminalHistory as el}{@html el.html}<br/>{/each}</pre>
		<textarea
			bind:this={$TerminalTextarea}
			bind:value={$TerminalValue}
			autocomplete="off"
			autocorrect="off"
			rows="1"
		/>
	</div>
{:else}
	<div class="collapsed">
		<pre bind:this={pre}>{#each $TerminalHistory as el}<span>{@html el.html}</span><br/>{/each}</pre>
	</div>
{/if}

<style>
	div {
		flex: 0 1 auto;
		width: 100%;
		display: flex;
		flex-direction: column;
/*		border-bottom: 2px solid var(--background-2);*/
		box-shadow: 0 0.25rem 0.25rem -0.25rem black;
		position: relative;
	}
	.expanded {
		height: 3.75rem;
	}
	.collapsed {
		height: 1.1rem;
	}
	.expand-button {
		all: unset;
		width: 1rem;
		height: 1rem;
	}
	pre, textarea {
		margin: 0;
		padding: 0 0.25rem;
	}
	pre {
		flex: 1 1 auto;
		overflow-x: hidden;
		overflow-y: scroll;
		font-family: monospace;
/*		color: var(--dim); */
		background-color: var(--background-1);
	}
	pre > * {
		margin: 0;
	}
	textarea {
		height: 1rem;
		flex: 0 0 auto;
		resize: none;
		border: 1px solid transparent;
		color: var(--text);
		outline-color: transparent;
		background-color: var(--background-0);
	}
	textarea:focus {
		outline: none !important;
		border: 1px solid var(--dim);
		outline-color: transparent;
		background-color: var(--background-0);
	}
	pre :global(.function) { color: var(--lightblue); }
	pre :global(.param) { color: var(--yellow); }
	pre :global(.error) { color: var(--red); }
	pre :global(.return) { color: var(--dim); }
	pre :global(.prompt-symbol) { color: var(--dim); }
</style>
