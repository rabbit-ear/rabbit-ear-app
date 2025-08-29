<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  let {
    children,
    expanded, // the initial condition
    title = "",
    ...rest
  }: {
    children: Snippet;
    expanded?: boolean;
    title?: string;
  } & HTMLAttributes<HTMLDivElement> = $props();

  let showPanel = $state(expanded === undefined ? true : expanded);

  const onclick = (): void => {
    showPanel = !showPanel;
  };
</script>

<div class="container" {...rest}>
  <button class={showPanel ? "title expanded" : "title collapsed"} {onclick}>
    <span>{title}</span>
    <!-- <hr /> -->
  </button>

  {#if showPanel}
    <div class="body">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  div {
    width: 100%;
  }

  button {
    all: unset;
    box-sizing: border-box;
    width: 100%;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  button:focus {
    outline: 2px solid var(--ui-blue);
    outline-offset: 2px;
  }

  .title span {
    pointer-events: none;
  }

  .title.expanded span {
    border-bottom: 1px solid var(--text);
  }

  .title.collapsed span {
    content: "\25BA";
    border-bottom: 1px solid transparent;
  }

  button span:before {
    margin-right: 6px;
  }

  .title.expanded span:before {
    content: "\25BC";
  }

  .title.collapsed span:before {
    content: "\25BA";
  }

  .title.expanded hr {
    height: 1px;
  }

  .title.collapsed hr {
    height: 0px;
  }

  .title {
    padding: 0.2rem 0.5rem;
    /* background-color: var(--ui-blue); */
    /* background-color: var(--background-3); */
    font-weight: bold;
  }

  .title.expanded {
    color: var(--text);
  }

  .title.collapsed {
    color: var(--dim);
  }

  .title:hover {
    color: var(--bright);
    /* background-color: var(--ui-dark-blue); */
    /* background-color: var(--background-4); */
  }

  .title.collapsed:hover {
    color: var(--text);
  }

  .body {
    padding: 0.5rem 0.5rem;
    /* background-color: var(--background-2); */
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
    gap: var(--form-gap);
  }
  .container :global(.center) {
    justify-content: center;
  }
</style>
