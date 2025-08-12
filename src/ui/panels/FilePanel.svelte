<script lang="ts">
  import context from "../../app/context.svelte.ts";

  let metadata = $derived(context.fileManager.document?.model.metadata);

  // const file_classes = ["singleModel", "multiModel", "animation", "diagrams"];
</script>

<div class="flex-column gap">
  {#if metadata}
    <input type="text" placeholder="title" bind:value={metadata.file_title} />
    <input type="text" placeholder="author" bind:value={metadata.file_author} />
    <textarea placeholder="description" bind:value={metadata.file_description}></textarea>
  {:else}
    <input type="text" placeholder="title" disabled />
    <input type="text" placeholder="author" disabled />
    <textarea placeholder="description" disabled></textarea>
  {/if}
</div>

<style>
  input[type="text"] {
    width: 100%;
  }
  textarea {
    width: 100%;
    resize: vertical;
  }
</style>
