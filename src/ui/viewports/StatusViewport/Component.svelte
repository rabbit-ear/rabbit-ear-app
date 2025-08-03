<script lang="ts">
  import context from "../../../app/context.svelte.ts";
  const documents = $derived(context.fileManager.documents);
  // const toolName = $derived(context.ui?.toolManager.toolName);
  // const toolName = $derived(context.ui?.toolManager.getTool()?.constructor.name);
  const toolName = $derived(context.ui?.toolManager.activeTool?.constructor.name);
</script>

<div>
  <h1>tool</h1>
  <p>{toolName}</p>
  <h1>files</h1>
  <p>index: {context.fileManager.activeIndex}/{context.fileManager.documents.length}</p>
  <ul>
    {#each documents as document}
      <li>{document.path}</li>
    {/each}
  </ul>
</div>
