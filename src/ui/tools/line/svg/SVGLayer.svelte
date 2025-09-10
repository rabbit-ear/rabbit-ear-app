<script lang="ts">
  import type { VecLine2 } from "rabbit-ear/types.js";
  import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";

  type PropsType = {
    viewport: SVGViewport;
    getLine: () => VecLine2 | undefined;
    getSegmentPoints: () => [number, number][] | undefined;
    getSegment: () => [number, number][] | undefined;
  };
  let { viewport, getLine, getSegment, getSegmentPoints }: PropsType = $props();

  const line = $derived(getLine());
  const segment = $derived(getSegment());
  const segmentPoints = $derived(getSegmentPoints());
  const lineClipped = $derived(line ? viewport.view.clipLine(line) : undefined);

  // const svgLine = $derived.by(() => {
  //   if (!lineClipped) {
  //     return undefined;
  //   }
  //   const [[x1, y1], [x2, y2]] = lineClipped;
  //   return { x1, y1, x2, y2 };
  // });

  const svgPath = $derived.by(() => {
    if (!lineClipped) {
      return undefined;
    }
    const [[x1, y1], [x2, y2]] = lineClipped;
    return { d: `M${x1},${y1}L${x2},${y2}` };
  });

  const svgSegment = $derived.by(() => {
    if (!segment) {
      return undefined;
    }
    const [[x1, y1], [x2, y2]] = segment;
    return { x1, y1, x2, y2 };
  });

  const svgCircles = $derived(
    !segmentPoints
      ? []
      : segmentPoints.map(([cx, cy]) => ({ cx, cy, r: viewport.style.circleRadius })),
  );
</script>

<!-- {#if svgLine} -->
<!--   <line class="animated-dashed-line" {...svgLine} /> -->
<!-- {/if} -->

{#if svgPath}
  <path class="animated-dashed-line" {...svgPath} />
{/if}

{#if svgSegment}
  <line class="highlighted" {...svgSegment} />
{/if}

{#each svgCircles as circle}
  <circle {...circle} />
{/each}

<style>
  circle {
    fill: #fb4;
    stroke: none;
  }
  line,
  path {
    fill: none;
    stroke: var(--text);
  }
  .highlighted {
    stroke: #fb4;
    stroke-width: var(--stroke-dash-length);
  }
  @keyframes animate-dash {
    from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: calc(500pt * var(--stroke-dash-length));
    }
  }
  .animated-dashed-line {
    stroke-dasharray: var(--stroke-dash-length);
    animation: 60s linear 0s infinite reverse both running animate-dash;
  }
</style>
