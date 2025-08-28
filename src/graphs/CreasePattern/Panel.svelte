<script lang="ts">
  import type { CreasePattern } from "./CreasePattern.svelte.ts";

  const { embedding }: { embedding: CreasePattern } = $props();

  embedding.attributes;

  const errors: string[] = $derived(embedding.errors ?? []);
</script>

<div class="column gap">
  <div class="row gap">
    <p>cp status</p>
  </div>
  {#each errors as error}
    <span class="error">{error}</span>
  {/each}
</div>

<style>
  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .gap {
    gap: var(--form-gap);
  }

  .error {
    color: #e53;
  }
</style>
