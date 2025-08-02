<script lang="ts">
  import context from "../../../state/context.svelte.ts";
  const documents = $derived(context.fileManager.documents);
</script>

<div>
  <h1>files</h1>
  <p>index: {context.fileManager.activeIndex}/{context.fileManager.documents.length}</p>
  <ul>
    {#each documents as document}
      <li>{document.path}</li>
    {/each}
  </ul>
</div>
