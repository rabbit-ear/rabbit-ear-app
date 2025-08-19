<script lang="ts">
  const { faceInfo, graph } = $props();

  const exists = $derived(faceInfo?.index !== undefined);
  const face = $derived(faceInfo?.index);
  const coords = $derived(faceInfo?.coords);
  const vertices = $derived(graph?.faces_vertices?.[face]);
</script>

{#if exists}
  <div class="flex-column gap">
    <p class="title">face [{face}]</p>
    <div class="flex-row gap">
      <p>vertices: <span class="strong">{vertices.join(", ")}</span></p>
    </div>
  </div>
{/if}

<style>
  .title {
    font-weight: bold;
    color: var(--bright);
  }
  .strong {
    font-weight: bold;
  }
</style>
