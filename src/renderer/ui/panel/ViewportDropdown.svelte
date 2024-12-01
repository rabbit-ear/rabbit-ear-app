<script lang="ts">
  import type { Snippet } from "svelte";
  import type { IModelViewport } from "../viewport/ViewportTypes.ts";
  import type { IModel } from "../../model/Model.svelte.ts";
  import Wrapper from "../panel/Wrapper.svelte";
  import app from "../../app/App.svelte";
  import { SVGViewport } from "../viewport/SVGViewport/SVGViewport.svelte.ts";
  import { WebGLViewport } from "../viewport/WebGLViewport/WebGLViewport.svelte.ts";

  let {
    index,
    viewport,
    children,
  }: { index: number; viewport?: IModelViewport; children: Snippet } = $props();

  const swapSVG = (): void => app.ui?.viewports.replace(index, SVGViewport);
  const swapWebGL = (): void => app.ui?.viewports.replace(index, WebGLViewport);

  let pad = "0.5rem";
  // background-color: #0002;
  let style = $derived(`position: absolute; top: ${pad}; right: ${pad};`);
</script>

<Wrapper title={"▼"} {style} expanded={false}>
  <div class="column gap">
    <div class="row gap">
      <p>View Model</p>
      <div class="row toggle-row">
        {#each Object.values(app.models.models) as model}
          <button
            class={viewport.model === model ? "highlighted" : ""}
            onclick={(): IModel => (viewport.model = model)}>{model.abbreviation}</button>
        {/each}
      </div>
    </div>

    <hr />

    <div class="row gap">
      <p>Renderer</p>
      <div class="row toggle-row">
        <button
          class={viewport?.constructor === SVGViewport ? "highlighted" : ""}
          onclick={swapSVG}>SVG</button>
        <button
          class={viewport?.constructor === WebGLViewport ? "highlighted" : ""}
          onclick={swapWebGL}>WebGL</button>
      </div>
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
    align-items: center;
  }
  .gap {
    gap: var(--form-gap);
  }
</style>
