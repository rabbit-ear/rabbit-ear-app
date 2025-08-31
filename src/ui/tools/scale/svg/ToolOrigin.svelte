<script lang="ts">
  import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";
  import type { FixedPoint } from "../state/FixedPoint.svelte.ts";

  type PropsType = {
    viewport: SVGViewport;
    getFixedPoint: () => FixedPoint;
  };
  let { viewport, getFixedPoint }: PropsType = $props();

  const highlighted = $derived(getFixedPoint().highlighted);
  const className = $derived(highlighted ? "highlighted" : "");
  const origin = $derived(getFixedPoint().origin);

  const smallR = 1.5 * 2;
  const bigR = 3 * 2;

  // svg elements
  const originCircle1 = $derived({
    cx: origin[0],
    cy: origin[1],
    r: viewport.style.circleRadius * smallR,
  });
  const originCircle2 = $derived({
    cx: origin[0],
    cy: origin[1],
    r: viewport.style.circleRadius * smallR,
  });
  const originLine1 = $derived({
    x1: origin[0],
    y1: origin[1] - viewport.style.circleRadius * bigR,
    x2: origin[0],
    y2: origin[1] + viewport.style.circleRadius * bigR,
  });
  const originLine2 = $derived({
    x1: origin[0] - viewport.style.circleRadius * bigR,
    y1: origin[1],
    x2: origin[0] + viewport.style.circleRadius * bigR,
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
    stroke: var(--yellow);
  }
</style>
