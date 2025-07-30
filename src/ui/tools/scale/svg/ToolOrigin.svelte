<script lang="ts">
  import type { SVGViewport } from "../../../viewport/SVGViewport/SVGViewport.svelte.ts";
  import type { SVGFixedPoint } from "./SVGViewportState.svelte.ts";

  type PropsType = {
    viewport: SVGViewport;
    fixedPoint: SVGFixedPoint;
  };
  let { viewport, fixedPoint }: PropsType = $props();

  const highlighted = $derived(fixedPoint.highlighted);
  const className = $derived(highlighted ? "highlighted" : "");
  const origin = $derived(fixedPoint.origin);

  // svg elements
  const originCircle1 = $derived({
    cx: origin[0],
    cy: origin[1],
    r: viewport.style.circleRadius * 1.5,
  });
  const originCircle2 = $derived({
    cx: origin[0],
    cy: origin[1],
    r: viewport.style.circleRadius * 1.5,
  });
  const originLine1 = $derived({
    x1: origin[0],
    y1: origin[1] - viewport.style.circleRadius * 3,
    x2: origin[0],
    y2: origin[1] + viewport.style.circleRadius * 3,
  });
  const originLine2 = $derived({
    x1: origin[0] - viewport.style.circleRadius * 3,
    y1: origin[1],
    x2: origin[0] + viewport.style.circleRadius * 3,
    y2: origin[1],
  });
</script>

<circle {...originCircle1} class={className} />
<circle {...originCircle2} class={className} />
<line {...originLine1} class={className} />
<line {...originLine2} class={className} />

<style>
  circle {
    fill: none;
    stroke: var(--text);
  }
  line {
    fill: none;
    stroke: var(--text);
  }
  .highlighted {
    stroke: #fb4;
  }
</style>
