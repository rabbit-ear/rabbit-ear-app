<script lang="ts">
  import { boundingBox } from "rabbit-ear/graph/boundary.js";
  import type { FOLD } from "rabbit-ear/types.js";
  import type { SVGAttributes } from "svelte/elements";

  type PropsType = {
    graph: FOLD;
  };

  const { graph }: PropsType & SVGAttributes<SVGGElement> = $props();

  const vertices_coords = $derived(graph.vertices_coords || []);

  const box = boundingBox(graph);
  const vmax = box === undefined ? Math.max(box.span[0], box.span[1]) : 1.0;
  const r = vmax * 0.01;
</script>

{#each vertices_coords as [cx, cy]}
  <circle {cx} {cy} {r} />
{/each}
