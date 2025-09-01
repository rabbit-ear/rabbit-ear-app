<script lang="ts">
  import type { SVGViewport } from "../../../viewports/SVGViewport/SVGViewport.svelte.ts";
  import type { Anchor } from "../state/Anchor.svelte.ts";

  type PropsType = {
    viewport: SVGViewport;
    getAnchor: () => Anchor;
  };
  let { viewport, getAnchor }: PropsType = $props();

  const highlighted = $derived(getAnchor().highlighted);
  const className = $derived(highlighted ? "highlighted" : "");
  const fixedOrigin = $derived(getAnchor().origin);
  const origin = $derived([
    !isNaN(fixedOrigin[0]) && isFinite(fixedOrigin[0]) ? fixedOrigin[0] : 0,
    !isNaN(fixedOrigin[1]) && isFinite(fixedOrigin[1]) ? fixedOrigin[1] : 0,
  ]);

  const smallR = 1.5;
  const bigR = 3;

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

  const vLine = $derived([
    [origin[0], origin[1] - viewport.style.circleRadius * bigR],
    [origin[0], origin[1] + viewport.style.circleRadius * bigR],
  ]);

  const hLine = $derived([
    [origin[0] - viewport.style.circleRadius * bigR, origin[1]],
    [origin[0] + viewport.style.circleRadius * bigR, origin[1]],
  ]);

  const path = $derived({
    d: `M${vLine[0].join(",")}L${vLine[1].join(",")}M${hLine[0].join(",")}L${hLine[1].join(",")}`,
  });
</script>

<circle {...originCircle1} class={className} />
<circle {...originCircle2} class={className} />
<path {...path} class={className} />

<style>
  circle {
    fill: none;
    stroke: var(--text);
  }
  path {
    fill: none;
    stroke: var(--text);
  }
  .highlighted {
    stroke: var(--yellow);
  }
</style>
