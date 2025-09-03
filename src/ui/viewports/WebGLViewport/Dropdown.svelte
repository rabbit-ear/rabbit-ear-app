<script lang="ts">
  import type { WebGLViewport } from "./WebGLViewport.svelte.ts";
  import MatricesView from "./MatricesView.svelte";
  import { RenderStyle, RenderPerspective } from "../types.ts";
  import context from "../../../app/context.svelte.ts";

  let { viewport }: { viewport: WebGLViewport } = $props();

  let isFolded = $derived(viewport.style.renderStyle === RenderStyle.foldedForm);

  const swapColors = (): void => {
    [
      context.ui.settings.modelColorFront.value,
      context.ui.settings.modelColorBack.value,
    ] = [
      context.ui.settings.modelColorBack.value,
      context.ui.settings.modelColorFront.value,
    ];
  };

  const modelNames: string[] = $derived(
    viewport.glModels.models.map((model) => model.constructor.name),
  );
</script>

<div class="row toggle-row">
  <button
    class={viewport.view.perspective === RenderPerspective.orthographic
      ? "highlighted"
      : ""}
    onclick={(): void => {
      viewport.view.perspective = RenderPerspective.orthographic;
    }}>2D</button>
  <button
    class={viewport.view.perspective === RenderPerspective.perspective
      ? "highlighted"
      : ""}
    onclick={(): void => {
      viewport.view.perspective = RenderPerspective.perspective;
    }}>3D</button>
</div>

<div class="row">
  <label for="input-fov">FOV</label>
  <input type="text" bind:value={viewport.view.fov} id="input-fov" />
</div>

{#if isFolded}
  <div class="row">
    <input type="color" bind:value={context.ui.settings.modelColorFront.value} />
    <input type="color" bind:value={context.ui.settings.modelColorBack.value} />
    <button aria-label="swap" class="swap" onclick={swapColors}>
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M17.87,54.839C21.262,55.828 29.583,57.569 37.011,56.599C42.415,55.894 47.313,53.752 50.418,49.723C52.556,46.95 53.953,43.241 53.871,38.234C53.866,37.909 53.867,37.312 53.871,36.523L53.906,31.218L43.296,31.151L43.263,36.455C43.257,37.355 43.257,38.036 43.263,38.407C43.296,40.492 42.723,41.969 42.016,43.246C40.918,45.227 38.163,47.804 35.663,49.082C31.976,50.968 25.214,52.638 21.139,52.969C13.82,53.564 12.778,53.354 12.778,53.354L17.87,54.839Z" />
        <path d="M29.558,23.098L14.917,46.804L1.054,22.773L29.558,23.098Z" />
        <path d="M34.182,41.144L48.822,17.438L62.685,41.469L34.182,41.144Z" />
        <path
          d="M45.938,9.359C42.546,8.37 34.226,6.629 26.797,7.598C21.393,8.304 16.496,10.446 13.391,14.475C11.252,17.248 9.856,20.957 9.938,25.964C9.942,26.289 9.941,26.886 9.937,27.675L9.903,32.98L20.512,33.047L20.545,27.743C20.552,26.843 20.552,26.162 20.545,25.791C20.512,23.706 21.086,22.229 21.792,20.952C22.89,18.971 25.645,16.394 28.145,15.115C31.832,13.23 38.594,11.56 42.67,11.229C49.989,10.634 51.03,10.844 51.03,10.844L45.938,9.359Z" />
      </svg>
    </button>
  </div>

  <div class="row">
    <input
      type="checkbox"
      id="checkbox-show-folded-faces"
      bind:checked={viewport.style.showFoldedFaces} /><label
      for="checkbox-show-folded-faces">show face</label>
  </div>

  <div class="row">
    <input
      type="checkbox"
      id="checkbox-show-folded-creases"
      bind:checked={viewport.style.showFoldedCreases} /><label
      for="checkbox-show-folded-creases">show creases</label>
  </div>

  <div class="row">
    <input
      type="checkbox"
      id="checkbox-show-folded-face-outlines"
      bind:checked={viewport.style.showFoldedFaceOutlines} /><label
      for="checkbox-show-folded-face-outlines">show face outlines</label>
  </div>
{/if}

<hr />

<p>WebGL Models ({modelNames.length})</p>
<ul>
  {#each modelNames as name}
    <li class="mono">{name}</li>
  {/each}
</ul>

<hr />

<ul>
  <li>render style: <span class="mono">{viewport?.style?.renderStyle}</span></li>
  <li>show folded faces: <span class="mono">{viewport?.style?.showFoldedFaces}</span></li>
  <li>
    show folded face outlines: <span class="mono"
      >{viewport?.style?.showFoldedFaceOutlines}</span>
  </li>
  <li>
    show folded creases: <span class="mono">{viewport?.style?.showFoldedCreases}</span>
  </li>
</ul>

<hr />

<MatricesView {viewport} />

<style>
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  button.swap {
    width: 1.5rem;
    height: 1.5rem;
    margin: 0;
    padding: 2px;
    border-radius: 0.5rem;
    background-color: #fff3;
  }

  button.swap svg {
    width: 100%;
    height: 100%;
    fill: var(--bright);
  }

  .mono {
    font-family: monospace;
  }
</style>
