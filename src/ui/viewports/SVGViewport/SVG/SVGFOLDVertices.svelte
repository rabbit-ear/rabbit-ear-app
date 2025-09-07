<script lang="ts">
  import type { FOLD } from "rabbit-ear/types.js";
  import type { SVGAttributes } from "svelte/elements";

  type PropsType = {
    graph: FOLD;
  };

  const { graph }: PropsType & SVGAttributes<SVGGElement> = $props();

  const vertices_coords = $derived(
    (graph.vertices_coords ?? []).filter((a) => a !== undefined),
  );
</script>

{#each vertices_coords as [cx, cy]}
  <circle {cx} {cy} r="var(--circle-radius)" />
{/each}

<style>
  circle {
    fill: var(--dim);
    stroke: none;
  }

  :global(.selection) circle {
    fill: var(--yellow);
  }
</style>
