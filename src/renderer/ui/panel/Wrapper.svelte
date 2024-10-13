<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Panel } from "../panel/panel.ts";
  let showPanel = $state(true);

  let { children, panel }: { children: Snippet; panel: Panel } = $props();

  const onclick = (): void => {
    showPanel = !showPanel;
  };
</script>

<div class="container">
  <button class={showPanel ? "title expanded" : "title collapsed"} {onclick}>
    <span>{panel.title}</span>
  </button>

  {#if showPanel}
    <div class="body">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .container {
    margin: 0.25rem;
  }

  button {
    all: unset;
    box-sizing: border-box;
    width: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  button:focus {
    outline: 2px solid var(--uiblue);
    outline-offset: 2px;
  }

  .title {
    padding: 0.2rem 0.5rem;
    /* background-color: var(--uiblue); */
    background-color: var(--background-3);
    font-weight: bold;
  }
  .title.expanded {
    color: var(--bright);
  }
  .title.collapsed {
    color: var(--dim);
  }
  .title:hover {
    /* background-color: var(--uidarkblue); */
    background-color: var(--background-4);
  }

  .body {
    padding: 0.5rem 0.5rem;
    background-color: var(--background-2);
  }

  .container :global(.flex-column) {
    display: flex;
    flex-direction: column;
  }
  .container :global(.flex-row) {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .container :global(.gap) {
    gap: 0.333rem;
  }
  .container :global(.center) {
    justify-content: center;
  }
</style>
