<script lang="ts">
  import type { SVGViewport } from "./SVGViewport.svelte.ts";
  let { viewport }: { viewport: SVGViewport } = $props();

  const embeddingExists = $derived(!!viewport.embedding?.graph);
</script>

<!-- <g class="grid-layer" stroke-width={viewport.grid.strokeWidth}> -->
<g
  class={embeddingExists ? "grid-layer" : "grid-layer no-model"}
  stroke-width={viewport.style.strokeWidthFixed}>
  {#each viewport.grid.lines as line}
    <line {...line} />
  {/each}

  <!--
  <rect
    x={viewport.view.aspectFitViewBox[0]}
    y={viewport.view.aspectFitViewBox[1]}
    width={viewport.view.aspectFitViewBox[2]}
    height={viewport.view.aspectFitViewBox[3]}
    stroke-width={viewport.grid.strokeWidth * 4}
    fill="none"
    stroke="red" />
  -->
</g>

<style>
  .grid-layer {
    stroke: var(--background-3);
  }
  .no-model {
    stroke: var(--dark-yellow);
  }
</style>
