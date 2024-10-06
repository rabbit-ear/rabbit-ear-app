<script lang="ts">
  import type { SVGViewport } from "./SVGViewport.svelte.ts";
  import GridLayer from "./GridLayer.svelte";
  import SVGTouchCanvas from "../../components/SVG/SVGTouchCanvas.svelte";
  import SVGElements from "../../components/SVG/SVGElements.svelte";
  import settings from "./Settings.svelte.ts";
  import app from "../../../app/App.svelte.ts";

  type PropsType = {
    viewport: SVGViewport;
    rest?: any[];
  };

  let { viewport, ...rest }: PropsType = $props();

  // https://www.youtube.com/live/nMs4X8-L_yo?feature=shared&t=1667
  const SVGToolLayer = $derived(viewport.layer);
  const svgToolLayerProps = $derived(viewport.props || {});

  const matrix = $derived(
    settings.rightHanded ? [1, 0, 0, -1, 0, 0].join(", ") : undefined,
  );

  const transformArgs = (args: any[]): any[] => {
    if (!matrix) {
      return args;
    }
    args
      .filter((arg) => arg.point)
      .forEach((arg) => {
        arg.point[1] *= -1;
      });
    return args;
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
  <SVGElements elements={app.model.shapes} class="model-layer" />
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
  onmousemove={(...args) => viewport.onmousemove?.(...transformArgs(args))}
  onmousedown={(...args) => viewport.onmousedown?.(...transformArgs(args))}
  onmouseup={(...args) => viewport.onmouseup?.(...transformArgs(args))}
  onmouseleave={(...args) => viewport.onmouseleave?.(...transformArgs(args))}
  onwheel={(...args) => viewport.onwheel?.(...transformArgs(args))}
  viewBox={viewport.view.viewBoxString}
  fill="none"
  stroke="white"
  stroke-width={viewport.style.strokeWidth}
  {...rest}>
  {#if matrix}
    <g class="wrapper" style="transform: matrix({matrix})">
      {@render contents()}
    </g>
  {:else}
    {@render contents()}
  {/if}
</SVGTouchCanvas>
