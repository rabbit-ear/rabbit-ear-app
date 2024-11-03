<script lang="ts">
  import type { SVGViewport } from "./SVGViewport.svelte.ts";
  import type {
    ViewportMouseEvent,
    ViewportWheelEvent,
    ViewportTouchEvent,
  } from "../../viewport/viewport.ts";
  import GridLayer from "./GridLayer.svelte";
  import SVGTouchCanvas from "../../components/SVG/SVGTouchCanvas.svelte";
  import SVGElements from "../../components/SVG/SVGElements.svelte";
  import SVGFOLD from "../../components/SVG/SVGFOLD.svelte";
  import settings from "./Settings/Settings.svelte.ts";
  import app from "../../../app/App.svelte.ts";

  type PropsType = {
    viewport: SVGViewport;
    props?: unknown[];
  };

  let { viewport, ...props }: PropsType = $props();

  // https://www.youtube.com/live/nMs4X8-L_yo?feature=shared&t=1667
  const SVGToolLayer = $derived(viewport.layer);
  const svgToolLayerProps = $derived(viewport.props || {});

  const matrix = $derived(
    settings.rightHanded ? [1, 0, 0, -1, 0, 0].join(", ") : undefined,
  );

  type HasPoint = {
    point: [number, number];
  };

  const prep = <T extends HasPoint>(event: T): T => {
    if (!matrix) {
      return event;
    }
    if (event.point) {
      event.point[1] *= -1;
    }
    return event;
  };

  let svg: SVGSVGElement | undefined = $state();

  // todo: issue-
  // creating and removing other Viewports causes a resize, but does not fire this.
  const onresize = (): void => {
    const size = svg?.getBoundingClientRect();
    viewport.view.canvasSize = size ? [size.width, size.height] : undefined;
  };

  // bind redraw function, used when new viewports are added/removed
  viewport.redraw = onresize;
</script>

<svelte:window {onresize} />

{#snippet contents()}
  {#if settings.showGrid}
    <GridLayer {viewport} />
  {/if}
  <SVGElements elements={app.file?.geometry.shapes} class="model-layer" />
  <SVGFOLD graph={app.file?.graph} />
  {#if SVGToolLayer}
    <g
      class="tool-layer"
      style={`--stroke-dash-length: ${viewport.style.strokeDashLength};`}>
      <SVGToolLayer class="hello-tool-layer" {viewport} {...svgToolLayerProps} />
    </g>
  {/if}
{/snippet}

<SVGTouchCanvas
  bind:svg
  onmousemove={(e: ViewportMouseEvent): void =>
    viewport.onmousemove?.(prep<ViewportMouseEvent>(e))}
  onmousedown={(e: ViewportMouseEvent): void =>
    viewport.onmousedown?.(prep<ViewportMouseEvent>(e))}
  onmouseup={(e: ViewportMouseEvent): void =>
    viewport.onmouseup?.(prep<ViewportMouseEvent>(e))}
  onmouseleave={(e: ViewportMouseEvent): void =>
    viewport.onmouseleave?.(prep<ViewportMouseEvent>(e))}
  onwheel={(e): void => viewport.onwheel?.(prep<ViewportWheelEvent>(e))}
  ontouchmove={(e): void => viewport.ontouchmove?.(prep<ViewportTouchEvent>(e))}
  ontouchstart={(e): void => viewport.ontouchstart?.(prep<ViewportTouchEvent>(e))}
  ontouchend={(e): void => viewport.ontouchend?.(prep<ViewportTouchEvent>(e))}
  ontouchcancel={(e): void => viewport.ontouchcancel?.(prep<ViewportTouchEvent>(e))}
  viewBox={viewport.view.viewBoxString}
  fill="none"
  stroke="white"
  stroke-width={viewport.style.strokeWidth}
  {...props}>
  {#if matrix}
    <g class="wrapper" style="transform: matrix({matrix})">
      {@render contents()}
    </g>
  {:else}
    {@render contents()}
  {/if}
</SVGTouchCanvas>
