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
		<pre bind:this={pre}><span>newEdge(20, 22)</span><br /><span>newVertex(0.4142, 0.5)</span><br /><span>newVertex(0, 0.9999999999999)</span><br /><span>newEdge(0, 1)</span><br /><span>no duplicate vertices found</span><br /><span>newEdge(7, 9)</span><br /><span>newVertex(0.5, 0.5)</span><br />{#each $TerminalHistory as line, i}<span>{line.func.name}({line.args ? line.args.map(arg => JSON.stringify(arg)).join(", ") : ""})</span><br/>{/each}</pre>
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
		<pre bind:this={pre}><span>newEdge(20, 22)</span><br /><span>newVertex(0.4142, 0.5)</span><br /><span>newVertex(0, 0.9999999999999)</span><br /><span>newEdge(0, 1)</span><br /><span>no duplicate vertices found</span><br /><span>newEdge(7, 9)</span><br /><span>newVertex(0.5, 0.5)</span><br />{#each $TerminalHistory as line, i}<span>{line.func.name}({line.args ? line.args.map(arg => JSON.stringify(arg)).join(", ") : ""})</span><br/>{/each}</pre>
	</div>
{/if}

<style>
	div {
		flex: 0 1 auto;
		width: 100%;
		display: flex;
		flex-direction: column;
		border-bottom: 2px solid var(--background-2);
	}
	.expanded {
		height: 3.75rem;
	}
	.collapsed {
		height: 1rem;
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
		color: var(--dim); 
		background-color: var(--background-2);
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
		background-color: var(--background-2);
	}
	textarea:focus {
		outline: none !important;
		border: 1px solid var(--background-3);
		outline-color: transparent;
		background-color: var(--background-0);
	}
</style>
