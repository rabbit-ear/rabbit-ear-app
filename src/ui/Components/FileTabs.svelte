<script lang="ts">
  import context from "../../app/context.svelte.ts";

  const files = $derived(context.fileManager.documents);
  const currentFile = $derived(context.fileManager.document);
</script>

<div class="container row gap short align-start">
  {#each files as file}
    <div class={file === currentFile ? "row file-item selected" : "row file-item"}>
      <button
        class="short file-button"
        onclick={() => context.fileManager.switchToDocument(file)}
        >{file.dirty ? `${file.name} *` : file.name}</button>
      <button
        class="short close-button"
        onclick={() => context.fileController.requestCloseDocument(file)}>X</button>
    </div>
  {/each}
</div>

<style>
  div {
    width: 100%;
    height: 100%;
  }

  button {
    width: 100%;
  }

  .short {
    height: 1.5rem;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .align-start {
    justify-content: start;
  }

  .gap {
    gap: var(--form-gap);
  }

  .container {
    background-color: var(--background-1);
    overflow-x: auto;
  }

  .file-button {
    /* width: 100%; */
    color: var(--dim);
    background-color: var(--background-2);
  }

  .close-button {
    width: 1.5rem;
    color: var(--text);
    background-color: var(--background-3);
  }

  .file-item {
    width: unset;
    min-width: 8rem;
    align-items: center;
    justify-content: space-between;
    flex: 0 0 auto;
  }

  .selected button {
    color: var(--text);
    background-color: var(--background-3);
  }
</style>
