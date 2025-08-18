<script lang="ts">
  import context from "../../app/context.svelte.ts";

  const data = $derived(context.fileManager.document?.data);
  const embeddingNames = ["cp", "folded", "simulator"];
  const embeddings = $derived(
    embeddingNames.map((name) => data?.getEmbedding(name)).filter((a) => a !== undefined),
  );
</script>

<div class="column gap">
  <div class="row">
    <p>embeddings: {embeddings.length}</p>
  </div>
  <div class="left-border">
    {#each embeddings as embedding}
      {#if embedding.panel}
        {#if embedding.errors?.length}
          {#each embedding.errors as error}
            <span class="error">{error}</span>
          {/each}
        {/if}
        <embedding.panel {embedding} />
      {/if}
    {/each}
  </div>
</div>

<style>
  p {
    pointer-events: none;
  }
  .gap {
    gap: var(--form-gap);
  }

  .error {
    color: #e53;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .left-border {
    border-left: 2px solid var(--background-4);
  }
</style>
