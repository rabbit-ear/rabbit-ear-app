<script lang="ts">
  import type { TerminalViewport } from "./TerminalViewport.svelte.ts";
  import app from "../../../app/App.svelte.ts";
  //import settings from "./Settings.svelte.ts";

  type PropsType = {
    viewport: TerminalViewport;
  };
  let { viewport }: PropsType = $props();

  // when the text area content updates, scroll to the bottom of the container.
  // the history is sorted newest-bottom, the old history will scroll
  // off the screen at the top.
  let historyContainer: Element;
  $effect(() => {
    viewport.terminalValue;
    historyContainer.scrollTop = historyContainer.scrollHeight;
  });

  let htmlString: string = $derived(app.invoker.historyAsHTML.join("\n"));

  // number of carriage returns in the input field
  const returnCount = $derived(
    ((viewport.terminalValue || "").match(/\r?\n/g) || []).length,
  );
  const rows = $derived(Math.max(returnCount + 1, 1));

  //<pre>{@html settings.commandHistoryHTMLString}</pre>

  // this is non standard and not a part of the HTMLTextarea spec
  // autocorrect="off"
</script>

<!--
<svelte:window onkeyup={viewport.onkeyup} onkeydown={viewport.onkeydown} />
-->

<div class="container">
  <div class="history-container" bind:this={historyContainer}>
    <pre>{@html htmlString}</pre>
  </div>
  <textarea
    bind:this={viewport.terminalTextarea}
    bind:value={viewport.terminalValue}
    autocomplete="off"
    onkeydown={viewport.onkeydown}
    onkeyup={viewport.onkeyup}
    {rows}></textarea>
</div>

<style>
  /* this contains the terminal history (pre) and the terminal input (textarea) */
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0.25rem 0.25rem -0.25rem black;
  }

  /* this conainer maintains a bottom-justification for the pre span elements */
  /* while functioning as a container for scrollable content (pre is scrollable) */
  .history-container {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #292929;
  }

  pre,
  textarea {
    margin: 0;
    padding: 0 0.25rem;
  }

  pre {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-height: 0;
    font-family: monospace;
    background-color: #292929;
  }

  /* all text selection has been disabled in the app. */
  /* we have to explicitly re-enable it here */
  pre :global(*) {
    -webkit-user-select: initial;
    user-select: initial;
    cursor: auto;
  }

  pre :global(.result::before) {
    content: "> ";
    color: #888;
  }

  textarea {
    min-height: 1rem;
    /*height: 1rem;*/
    flex: 0 0 auto;
    resize: none;
    border: 0;
    outline-color: transparent;
    background-color: #393939;
  }

  textarea:focus {
    border: 0;
    outline-color: transparent;
    outline: none !important;
    background-color: #393939;
  }

  pre :global(.error) {
    color: var(--red);
  }
  pre :global(.return) {
    color: var(--dim);
  }
  pre :global(.prompt-symbol) {
    color: var(--dim);
  }
  pre :global(.IdentifierName) {
    color: var(--green);
  }
  pre :global(.Punctuator) {
    color: var(--text);
  }
  pre :global(.NumericLiteral) {
    color: var(--lightblue);
  }
  pre :global(.WhiteSpace) {
    color: var(--text);
  }
  pre :global(.StringLiteral) {
    color: var(--yellow);
  }
  /* these have not been seen yet, setting purple by default */
  pre :global(.NoSubstitutionTemplate) {
    color: var(--purple);
  }
  pre :global(.TemplateHead) {
    color: var(--purple);
  }
  pre :global(.TemplateMiddle) {
    color: var(--purple);
  }
  pre :global(.TemplateTail) {
    color: var(--purple);
  }
  pre :global(.RegularExpressionLiteral) {
    color: var(--purple);
  }
  pre :global(.MultiLineComment) {
    color: var(--purple);
  }
  pre :global(.SingleLineComment) {
    color: var(--purple);
  }
  pre :global(.PrivateIdentifier) {
    color: var(--purple);
  }
  pre :global(.LineTerminatorSequence) {
    color: var(--purple);
  }
  pre :global(.Invalid) {
    color: var(--purple);
  }
</style>
