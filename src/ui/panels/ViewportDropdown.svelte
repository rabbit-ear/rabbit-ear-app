<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Viewport } from "../viewports/Viewport.ts";
  import { SVGViewport } from "../viewports/SVGViewport/SVGViewport.svelte.ts";
  import { WebGLViewport } from "../viewports/WebGLViewport/WebGLViewport.svelte.ts";
  import Wrapper from "./Wrapper.svelte";
  import context from "../../app/context.svelte.ts";

  let {
    index,
    viewport,
    children,
  }: { index: number; viewport: Viewport; children: Snippet } = $props();

  // these match with the Viewport.embeddingName property
  const embeddingNames = ["creasePattern", "foldedForm", "simulator"];
  // convert the above into what is shown on screen (abbreviated if necessary)
  const embeddingNameReadable: { [key: string]: string } = {
    creasePattern: "cp",
    foldedForm: "folded",
    simulator: "sim",
  };

  const swapSVG = (): void =>
    context.ui.viewportManager.replaceViewportWithName(index, "SVGViewport");
  const swapWebGL = (): void =>
    context.ui.viewportManager.replaceViewportWithName(index, "WebGLViewport");
  const removeViewport = () => {
    if (viewport) {
      context.ui.viewportManager.removeViewport(viewport);
    }
  };

  let pad = "0.5rem";
  // background-color: #0002;
  let style = $derived(`position: absolute; top: ${pad}; right: ${pad};`);
</script>

<Wrapper title={"▼"} {style} expanded={false}>
  <div class="column gap">
    <div class="row right">
      <button onclick={removeViewport}>- Remove</button>
    </div>

    <div class="row gap">
      <p>Embedding</p>
    </div>
    <div class="row gap">
      <div class="row toggle-row">
        {#each embeddingNames as name}
          <button
            class={viewport.embeddingName === name ? "highlighted" : ""}
            onclick={() => {
              viewport.embeddingName = name;
            }}>{embeddingNameReadable[name]}</button>
        {/each}
      </div>
    </div>

    <div class="row gap">
      <p>Renderer</p>
    </div>
    <div class="row gap">
      <div class="row toggle-row">
        <button
          class={viewport?.constructor === SVGViewport ? "highlighted" : ""}
          onclick={swapSVG}>SVG</button>
        <button
          class={viewport?.constructor === WebGLViewport ? "highlighted" : ""}
          onclick={swapWebGL}>WebGL</button>
      </div>
    </div>
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
  .right {
    justify-content: end;
  }
</style>
