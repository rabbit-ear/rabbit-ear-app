<script lang="ts">
  import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";

  type PropsType = {
    rect: { x: number; y: number; width: number; height: number };
    viewport: SVGViewport;
  };
  let { rect }: PropsType = $props();
</script>

{#if rect}
  <rect {...rect} />
{/if}

<style>
  rect {
    fill: none;
    stroke: #fb4;
  }
</style>
