<script lang="ts">
  import type { EventHandler } from "svelte/elements";
  import type { Snippet } from "svelte";

  interface PropsType {
    dialog?: HTMLDialogElement;
    onclose?: EventHandler<Event, HTMLDialogElement>;
    oncancel?: EventHandler<Event, HTMLDialogElement>;
    children?: Snippet;
  }

  let {
    dialog = $bindable(),
    onclose = () => {},
    oncancel = () => {},
    children,
  }: PropsType = $props();
</script>

<dialog {onclose} {oncancel} bind:this={dialog}>
  {#if children}
    {@render children()}
  {/if}
</dialog>

<style>
  dialog {
    padding: 1rem;
    background-color: #282222ee;
    border: 1px solid var(--dim);
    border-radius: 1rem;
    box-shadow: 0 0 1rem black;
  }
  dialog::backdrop {
    background-color: #0004;
  }
</style>
