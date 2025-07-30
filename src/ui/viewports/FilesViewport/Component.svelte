<script lang="ts">
  import app from "../../../state/app.svelte.ts";
  const documents = $derived(app.fileManager.documents);
</script>

<div>
  <h1>files</h1>
  <p>index: {app.fileManager.activeIndex}/{app.fileManager.documents.length}</p>
  <ul>
    {#each documents as document}
      <li>{document.path}</li>
    {/each}
  </ul>
</div>
