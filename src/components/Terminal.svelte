<script>
	import { afterUpdate } from "svelte";
	import { TerminalHistory } from "../stores/History.js";
	import {
		TerminalTextarea,
		TerminalValue,
	} from "../stores/App.js";

	let pre;
	afterUpdate(() => { pre.scrollTop = pre.scrollHeight; });
</script>

<div class="container">
	<pre bind:this={pre}>{#each $TerminalHistory as el}{@html el.html}<br/>{/each}</pre>
	<textarea
		bind:this={$TerminalTextarea}
		bind:value={$TerminalValue}
		autocomplete="off"
		autocorrect="off"
		rows="1"
	/>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0.25rem 0.25rem -0.25rem black;
		border-bottom: 2px solid var(--background-2);
/*		position: relative;*/
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
	pre :global(.error) { color: var(--red); }
	pre :global(.return) { color: var(--dim); }
	pre :global(.prompt-symbol) { color: var(--dim); }

	pre :global(.IdentifierName) { color: var(--green); }
	pre :global(.Punctuator) { color: var(--text); }
	pre :global(.NumericLiteral) { color: var(--lightblue); }
	pre :global(.WhiteSpace) { color: var(--text); }
	pre :global(.StringLiteral) { color: var(--yellow); }

	/* these have not been seen yet, setting purple by default */
  pre :global(.NoSubstitutionTemplate) { color: var(--purple); }
  pre :global(.TemplateHead) { color: var(--purple); }
  pre :global(.TemplateMiddle) { color: var(--purple); }
  pre :global(.TemplateTail) { color: var(--purple); }
  pre :global(.RegularExpressionLiteral) { color: var(--purple); }
  pre :global(.MultiLineComment) { color: var(--purple); }
  pre :global(.SingleLineComment) { color: var(--purple); }
  pre :global(.PrivateIdentifier) { color: var(--purple); }
  pre :global(.LineTerminatorSequence) { color: var(--purple); }
  pre :global(.Invalid) { color: var(--purple); }
</style>
