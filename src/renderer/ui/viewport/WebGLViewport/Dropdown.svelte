<script lang="ts">
  import { untrack } from "svelte";
  import settings from "./Settings/ClassSettings.svelte.ts";
  import type { WebGLViewport } from "./WebGLViewport.svelte.ts";

  //let { panel, viewport }: { panel: ViewportPanel; viewport: WebGLViewport } = $props();
  let { viewport }: { viewport: WebGLViewport } = $props();

  let isFolded = $derived(viewport.view.renderStyle === "foldedForm");

  let strokeWidthSlider = $state(5);
  let layerNudgeSlider = $state(6);

  $effect(() => {
    settings.strokeWidth = Math.pow(2, strokeWidthSlider) / 1e5;
  });

  $effect(() => {
    settings.layerNudge = Math.pow(2, layerNudgeSlider) / 1e6;
  });

  $effect(() => {
    //const bounds = boundingBox(Frame.value);
    //const strokeWidthGuess =
    //  bounds && bounds.span
    //    ? getStrokeWidth(Frame.value, Math.max(...bounds.span))
    //    : getStrokeWidth(Frame.value);

    // todo: hardcoded
    const bounds = { span: [1, 1] };
    const strokeWidthGuess = 0.005;

    //
    let newStrokeWidth: number = 0;
    untrack(() => {
      // invert this: Math.pow(2, strokeWidthSlider) / 1e5;
      strokeWidthSlider = Math.log2(strokeWidthGuess * 1e5);
      newStrokeWidth = Math.pow(2, strokeWidthSlider) / 1e5;
    });
    settings.strokeWidth = newStrokeWidth;

    // find a decent spacing between layers (LayerNudge)
    if (bounds && bounds.span) {
      const maxSpan = Math.max(...bounds.span);
      let newLayerNudge: number = 0;
      untrack(() => {
        layerNudgeSlider = Math.log2(maxSpan * 0.001 * 1e5);
        newLayerNudge = Math.pow(2, layerNudgeSlider) / 1e6;
      });
      settings.layerNudge = newLayerNudge;
    }
  });

  const swapColors = (): void => {
    [viewport.view.frontColor, viewport.view.backColor] = [
      viewport.view.backColor,
      viewport.view.frontColor,
    ];
  };
</script>

<div class="row toggle-row">
  <button
    class={viewport.view.perspective === "orthographic" ? "highlighted" : ""}
    onclick={(): void => {
      viewport.view.perspective = "orthographic";
    }}>2D</button>
  <button
    class={viewport.view.perspective === "perspective" ? "highlighted" : ""}
    onclick={(): void => {
      viewport.view.perspective = "perspective";
    }}>3D</button>
</div>

<div class="row toggle-row">
  <button
    class={viewport.view.renderStyle === "creasePattern" ? "highlighted" : ""}
    onclick={(): string => (viewport.view.renderStyle = "creasePattern")}>cp</button>
  <button
    class={viewport.view.renderStyle === "foldedForm" ? "highlighted" : ""}
    onclick={(): string => (viewport.view.renderStyle = "foldedForm")}>folded</button>
</div>

<div class="row">
  <label for="input-fov">FOV</label>
  <input type="text" bind:value={viewport.view.fov} id="input-fov" />
</div>

<div class="row">
  <label for="input-stroke-width-slider">stroke</label>
  <input
    id="input-stroke-width-slider"
    type="range"
    min="1"
    max="20"
    step="0.01"
    bind:value={strokeWidthSlider} />
</div>

{#if isFolded}
  <div class="row">
    <input type="color" bind:value={viewport.view.frontColor} />
    <input type="color" bind:value={viewport.view.backColor} />
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
      bind:checked={viewport.view.showFoldedFaces} /><label
      for="checkbox-show-folded-faces">show face</label>
  </div>

  <div class="row">
    <input
      type="checkbox"
      id="checkbox-show-folded-creases"
      bind:checked={viewport.view.showFoldedCreases} /><label
      for="checkbox-show-folded-creases">show creases</label>
  </div>

  <div class="row">
    <input
      type="checkbox"
      id="checkbox-show-folded-face-outlines"
      bind:checked={viewport.view.showFoldedFaceOutlines} /><label
      for="checkbox-show-folded-face-outlines">show face outlines</label>
  </div>

  <div class="row">
    <div>
      <input
        type="range"
        min="1"
        max="20"
        step="0.01"
        id="slider-layer-nudge"
        bind:value={layerNudgeSlider} />
    </div>
    <div>
      <input type="text" class="long-input" bind:value={settings.layerNudge} />
    </div>
  </div>
{/if}

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
    fill: var(--bright);
  }
</style>
