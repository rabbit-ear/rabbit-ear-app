<script lang="ts">
  import type { Component } from "svelte";
  import app from "../../app/App.svelte.ts";

  const { name, Icon }: { name: string; Icon?: Component } = $props();

  const highlighted = $derived(
    name === app.ui?.tool?.constructor.name ? "highlighted" : undefined,
  );

  const className = $derived(
    [name, highlighted].filter((a) => a !== undefined).join(" "),
  );
</script>

<button
  title={name}
  class={className}
  disabled={false}
  onclick={() => app.ui?.setToolName(name)}>
  {#if Icon}
    <Icon></Icon>
  {/if}
</button>

<style>
  button {
    width: 2rem;
    height: 2rem;
    display: inline-block;
    margin: 0.15rem;
    padding: 0;
    border: 0px solid;
    border-radius: 0.25rem;
    cursor: pointer;
    background-color: transparent;
  }

  button {
    stroke: var(--text);
    fill: var(--text);
  }

  button:hover {
    stroke: var(--bright);
    fill: var(--bright);
  }

  button.highlighted {
    background-color: var(--highlight);
    stroke: var(--background-1);
    fill: var(--background-1);
  }

  button[disabled],
  button[disabled]:hover {
    background-color: transparent;
    stroke: var(--dim);
    fill: var(--dim);
    cursor: initial;
  }

  button:focus {
    outline-offset: -1px;
    outline: 2px solid var(--uiblue);
  }
</style>
