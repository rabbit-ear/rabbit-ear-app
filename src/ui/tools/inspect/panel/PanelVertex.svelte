<script lang="ts">
  const { vertexInfo } = $props();

  const exists = $derived(vertexInfo?.coords !== undefined);
  const index = $derived(vertexInfo?.index);
  const coords = $derived(vertexInfo?.coords);
</script>

{#if exists}
  <div class="flex-column gap">
    <p class="title">vertex [{index}]</p>
    <div class="flex-column">
      {#each coords as value, i}
        <!-- <input type="number" bind:value={coords[i]} /> -->
        <input type="number" {value} />
      {/each}
    </div>
  </div>
{/if}

<style>
  .title {
    font-weight: bold;
    color: var(--bright);
  }
</style>
