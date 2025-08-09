<script lang="ts">
  import context from "../../app/context.svelte.ts";

  const undoStack = context.fileManager.document?.getUndoStack();
  const redoStack = context.fileManager.document?.getRedoStack();
</script>

<div class="column gap">
  {#each undoStack as item, i}
    <div class="row gap undo">
      <p>item.constructor.name</p>
    </div>
  {/each}
  {#each redoStack as item, i}
    <div class="row gap redo">
      <p>item.constructor.name</p>
    </div>
  {/each}
</div>

<style>
  p {
    pointer-events: none;
  }
  .gap {
    gap: var(--form-gap);
  }
  /*.sm-gap {*/
  /*  gap: 3px;*/
  /*}*/

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
</style>
