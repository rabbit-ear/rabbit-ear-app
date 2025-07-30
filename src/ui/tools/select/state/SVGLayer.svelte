<script lang="ts">
  import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";

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
  @keyframes animate-dash {
    from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: calc(500pt * var(--stroke-dash-length));
    }
  }
  rect {
    fill: none;
    stroke: var(--text);
    stroke-dasharray: var(--stroke-dash-length);
    animation: 60s linear 0s infinite reverse both running animate-dash;
  }
</style>
