<script lang="ts">
  import type { Snippet } from "svelte";
  import type { IViewport } from "../viewport/viewport.ts";
  import Wrapper from "../panel/Wrapper.svelte";
  import app from "../../app/App.svelte";
  import { SVGViewport } from "../viewport/SVGViewport/SVGViewport.svelte.ts";
  import { WebGLViewport } from "../viewport/WebGLViewport/WebGLViewport.svelte.ts";
  import { SimulatorViewport } from "../viewport/SimulatorViewport/SimulatorViewport.svelte.ts";

  let {
    index,
    viewport,
    children,
  }: { index: number; viewport?: IViewport; children: Snippet } = $props();

  const swapSVG = (): void => app.ui?.viewports.replace(index, SVGViewport);
  const swapWebGL = (): void => app.ui?.viewports.replace(index, WebGLViewport);
  const swapSimulator = (): void => app.ui?.viewports.replace(index, SimulatorViewport);

  let pad = $state("0.5rem");
  // background-color: #0002;
  let style = $derived(`position: absolute; top: ${pad}; right: ${pad};`);
</script>

<Wrapper title={"▼"} {style} expanded={false}>
  <div class="column gap">
    <div class="row toggle-row">
      <button
        class={viewport?.constructor === SVGViewport ? "highlighted" : ""}
        onclick={swapSVG}>SVG</button>
      <button
        class={viewport?.constructor === WebGLViewport ? "highlighted" : ""}
        onclick={swapWebGL}>WebGL</button>
      <button
        class={viewport?.constructor === SimulatorViewport ? "highlighted" : ""}
        onclick={swapSimulator}>Sim</button>
    </div>
    <hr />
    {@render children?.()}
  </div>
</Wrapper>

<style>
  .column {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
  .gap {
    gap: var(--form-gap);
  }
</style>
