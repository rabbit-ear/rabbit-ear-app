<script lang="ts">
  import { onMount } from "svelte";
  import { SVGViewport } from "./SVGViewport.svelte.ts";
  import SVGCanvas from "../../Components/SVG/SVGCanvas.svelte";
  import GridLayer from "./GridLayer.svelte";
  // import ModelLayer from "./ModelLayer.svelte";
  // import SVGShapes from "../../Components/SVG/SVGShapes.svelte";
  import SVGFOLD from "../../Components/SVG/SVGFOLD.svelte";

  type PropsType = {
    viewport: SVGViewport;
    props?: unknown[];
  };

  let { viewport, ...props }: PropsType = $props();

  let svg: SVGSVGElement | undefined = $state();

  const graph = $derived(viewport.model?.graph);

  // https://www.youtube.com/live/nMs4X8-L_yo?feature=shared&t=1667
  const SVGToolLayer = $derived(viewport.layer);
  const svgToolLayerProps = $derived(viewport.props || {});

  const svgStyle = $derived(`--circle-radius: ${viewport.style.circleRadius};`);
  const toolStyle = $derived(`--stroke-dash-length: ${viewport.style.strokeDashLength};`);

  const matrix = $derived(
    SVGViewport.settings.rightHanded ? [1, 0, 0, -1, 0, 0].join(", ") : undefined,
  );

  $effect(() => {
    viewport.domElement = svg;
  });

  onMount(() => {
    // console.log("SVGViewport has mounted", viewport.domElement);
    if (typeof viewport.didMount === "function") {
      viewport.didMount();
    }
  });

  // todo: issue-
  // creating and removing other Viewports causes a resize, but does not fire this.
  // const onresize = (): void => {
  //   const size = svg?.getBoundingClientRect();
  //   viewport.view.canvasSize = size ? [size.width, size.height] : undefined;
  // };

  // bind redraw function, used when new viewports are added/removed
  // viewport.redraw = onresize;
</script>

<svelte:window {onresize} />

{#snippet toolLayer()}
  {#if SVGToolLayer}
    <g class="tool-layer" style={toolStyle}>
      <SVGToolLayer class="hello-tool-layer" {viewport} {...svgToolLayerProps} />
    </g>
  {/if}
{/snippet}

{#snippet gridLayer()}
  {#if SVGViewport.settings.showGrid}
    <GridLayer {viewport} />
  {/if}
{/snippet}

<SVGCanvas
  bind:svg
  fill="none"
  stroke="white"
  viewBox={viewport.view.viewBoxString}
  stroke-width={viewport.style.strokeWidth}
  style={svgStyle}
  {...props}>
  {#if matrix}
    <g class="wrapper" style="transform: matrix({matrix})">
      {@render gridLayer()}
      <SVGFOLD {graph} {viewport} />
      <!-- <SVGShapes shapes={viewport.model?.shapes} class="model-layer" /> -->
      {@render toolLayer()}
    </g>
  {:else}
    {@render gridLayer()}
    <SVGFOLD {graph} {viewport} />
    <!-- <SVGShapes shapes={viewport.model?.shapes} class="model-layer" /> -->
    {@render toolLayer()}
  {/if}
</SVGCanvas>
