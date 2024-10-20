<script lang="ts">
  import type { Panel } from "../panel/panel.ts";
  import Wrapper from "../panel/Wrapper.svelte";
  import app from "../../app/App.svelte";
  import { SVGViewport } from "../viewport/SVGViewport/SVGViewport.svelte.ts";
  import { WebGLViewport } from "../viewport/WebGLViewport/WebGLViewport.svelte.ts";
  let { index, panel }: { index: number; panel?: Panel | undefined } = $props();

  let PanelComponent = $derived(panel?.component);
  let wrapperPanel = $derived({ ...panel, title: "▼" });

  const swapSVG = (): void => app.ui?.swapViewport(index, SVGViewport);
  const swapWebGL = (): void => app.ui?.swapViewport(index, WebGLViewport);

  let pad = $state("0.5rem");
  // background-color: #0002;
  let style = $derived(`position: absolute; top: ${pad}; right: ${pad};`);
</script>

<Wrapper panel={wrapperPanel} {style} expanded={false}>
  <div class="row">
    <button onclick={swapSVG}>SVG</button>
    <button onclick={swapWebGL}>WebGL</button>
  </div>
  {#if PanelComponent}
    <PanelComponent {panel} />
  {/if}
</Wrapper>

<style>
  .row {
    display: flex;
    flex-direction: row;
  }
</style>
