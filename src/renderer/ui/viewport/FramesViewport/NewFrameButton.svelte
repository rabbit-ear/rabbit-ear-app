<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  let { onclick }: HTMLButtonAttributes = $props();
</script>

<button {onclick} aria-label="New Frame">
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <rect x="35" y="20" width="10" height="40" />
    <rect x="20" y="35" width="40" height="10" />
  </svg>
</button>

<style>
  svg {
    fill: var(--dim);
  }

  svg:hover {
    fill: var(--highlight);
  }

  button {
    all: unset;
    cursor: pointer;
    flex: 0 0 auto;
    width: 5rem;
    height: 5rem;
    /* margin: 0.5rem 0; */
    border: 2px solid transparent;
    border-radius: 4px;
  }

  button:hover {
    border-color: var(--highlight);
  }

  button:focus {
    outline-offset: -2px;
    outline: 2px solid var(--uiblue);
  }

  button:focus svg {
    fill: var(--uiblue);
  }
</style>
