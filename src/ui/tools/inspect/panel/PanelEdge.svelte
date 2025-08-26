<script lang="ts">
  import type { FOLD } from "rabbit-ear/types.js";

  const { edgeInfo, graph }: { edgeInfo: any; graph: FOLD } = $props();

  const exists = $derived(edgeInfo?.index !== undefined);
  const edge = $derived(edgeInfo?.index);
  // const coords = $derived(edgeInfo?.coords);
  const vertices = $derived(graph?.edges_vertices?.[edge]);
  const assignment = $derived(graph?.edges_assignment?.[edge]);
  const foldAngle = $derived(graph?.edges_foldAngle?.[edge]);

  const verticesString = $derived((vertices ?? []).join(", "));
</script>

{#if exists}
  <div class="flex-column gap">
    <p class="title">edge [{edge}]</p>
    <div class="flex-row gap">
      <p>assignment:</p>
      <!-- <input type="text" bind:value={assignment} /> -->
      <input type="text" value={assignment} />
    </div>
    <div class="flex-row gap">
      <p>fold angle:</p>
      <!-- <input type="number" bind:value={foldAngle} /> -->
      <input type="number" value={foldAngle} />
    </div>
    <div class="flex-row gap">
      <p>vertices: <span class="strong">{verticesString}</span></p>
    </div>
  </div>
{/if}

<style>
  input {
    width: 100%;
  }
  p {
    flex-shrink: 0;
  }
  .title {
    font-weight: bold;
    color: var(--bright);
  }
  .strong {
    font-weight: bold;
  }
</style>
