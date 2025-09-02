<script lang="ts">
  import context from "../../app/context.svelte.ts";

  const undoStack = $derived(context.fileManager.document?.undoStack);
  const redoStack = $derived(context.fileManager.document?.redoStack);

  const undoUntilIndex = (index: number) =>
    context.fileManager.document?.undoUntilIndex(index);
  const redoUntilIndex = (index: number) =>
    context.fileManager.document?.redoUntilIndex(index);
</script>

<div class="scrollable column gap">
  {#each undoStack as item, i}
    <div class="row gap undo">
      <button onclick={() => undoUntilIndex(i)}>{item.constructor.name}</button>
    </div>
  {/each}
  {#each redoStack as item, i}
    <div class="row gap redo">
      <button onclick={() => redoUntilIndex(i)}>{item.constructor.name}</button>
    </div>
  {/each}
</div>

<style>
  .scrollable {
    max-height: 10rem;
    overflow-y: auto;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .redo {
    color: var(--dim);
  }

  button {
    all: unset;
    cursor: pointer;
    font-size: 0.75rem;
  }

  button:hover {
    all: unset;
    cursor: pointer;
    color: var(--bright);
    font-size: 0.75rem;
  }

  .gap {
    gap: var(--form-gap);
  }
</style>
