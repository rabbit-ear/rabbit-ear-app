<script lang="ts">
  import context from "../../app/context.svelte.ts";

  const data = $derived(context.fileManager.document?.data);
  const embeddingNames = ["cp", "folded", "simulator"];
  const embeddings = $derived(
    embeddingNames.map((name) => data?.getEmbedding(name)).filter((a) => a !== undefined),
  );
</script>

<div class="column gap">
  {#each embeddings as embedding}
    {#if embedding.panel}
      <div class="row">
        <embedding.panel {embedding} />
      </div>
    {/if}
  {/each}
</div>

<style>
  .gap {
    gap: var(--form-gap);
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
  }
</style>
