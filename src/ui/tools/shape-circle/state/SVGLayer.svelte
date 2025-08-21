<script lang="ts">
  import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";

  type PropsType = {
    getSVGCircle(): { cx: number; cy: number; r: number };
    viewport: SVGViewport;
  };
  let { getSVGCircle, viewport }: PropsType = $props();

  const circle = $derived(getSVGCircle());
</script>

{#if circle}
  <circle {...circle} stroke-width={viewport.style.strokeWidthFixed} />
{/if}

<style>
  circle {
    fill: none;
    stroke: var(--text);
  }
</style>
