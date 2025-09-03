<script lang="ts">
  import { untrack } from "svelte";
  import context from "../../app/context.svelte.ts";
  import t from "../../app/t.ts";
  import LogSlider from "../Components/LogSlider.svelte";

  let layersNudgeSlider = $state(6);

  const sel = $derived(context.fileManager.document?.data.selection);
  const selection = $derived(
    sel
      ? `V ${sel.vertices?.length ?? 0} / E ${sel.edges?.length ?? 0} / F ${sel.faces?.length ?? 0}`
      : undefined,
  );

  $effect(() => {
    context.ui.settings.layersNudge.value = Math.pow(2, layersNudgeSlider) / 1e6;
  });

  $effect(() => {
    //const bounds = boundingBox(Frame.value);
    //const strokeWidthGuess =
    //  bounds && bounds.span
    //    ? getStrokeWidth(Frame.value, Math.max(...bounds.span))
    //    : getStrokeWidth(Frame.value);

    // todo: hardcoded
    const bounds = { span: [1, 1] };

    // find a decent spacing between layers (LayerNudge)
    if (bounds && bounds.span) {
      const maxSpan = Math.max(...bounds.span);
      let newLayerNudge: number = 0;
      untrack(() => {
        layersNudgeSlider = Math.log2(maxSpan * 0.001 * 1e5);
        newLayerNudge = Math.pow(2, layersNudgeSlider) / 1e6;
      });
      context.ui.settings.layersNudge.value = newLayerNudge;
    }
  });
</script>

<div class="column gap">
  <div class="row toggle-row">
    <p class="gap-after">selection</p>
    <button
      class={context.ui.settings.selectionHandling.value === "detach"
        ? "highlighted"
        : ""}
      onclick={(): string => (context.ui.settings.selectionHandling.value = "detach")}
      >detach</button>
    <button
      class={context.ui.settings.selectionHandling.value === "stretch"
        ? "highlighted"
        : ""}
      onclick={(): string => (context.ui.settings.selectionHandling.value = "stretch")}
      >stretch</button>
  </div>

  {#if selection}
    <div class="row">
      <p>{selection}</p>
    </div>
  {/if}

  <hr />

  <div class="row gap">
    <input
      type="checkbox"
      id="right-handed"
      bind:checked={context.ui.settings.rightHanded.value} />
    <label for="right-handed">right handed</label>
  </div>

  <div class="row gap">
    <label for="range-stroke-width">{t("ui.viewports.stroke")}</label>
    <LogSlider
      id="range-stroke-width"
      radix={5}
      bind:value={context.ui.settings.strokeWidthFactor.value} />
  </div>

  <div class="row">
    <input
      type="checkbox"
      id="checkbox-show-grid"
      bind:checked={context.ui.settings.showGrid.value} /><label for="checkbox-show-grid"
      >show grid</label>
  </div>

  <div class="row">
    <input
      type="checkbox"
      id="checkbox-show-axes"
      bind:checked={context.ui.settings.showAxes.value} /><label for="checkbox-show-axes"
      >show axes</label>
  </div>

  <div class="row toggle-row">
    <p class="gap-after">grid</p>
    <button
      class={context.ui.settings.tiling.value === "triangle" ? "highlighted" : ""}
      onclick={(): string => (context.ui.settings.tiling.value = "triangle")}
      >triangle</button>
    <button
      class={context.ui.settings.tiling.value === "square" ? "highlighted" : ""}
      onclick={(): string => (context.ui.settings.tiling.value = "square")}>rect</button>
  </div>

  <div class="row">
    <div>
      <input
        type="range"
        min="1"
        max="20"
        step="0.01"
        id="slider-layer-nudge"
        bind:value={layersNudgeSlider} />
    </div>
    <div>
      <input
        type="text"
        class="long-input"
        bind:value={context.ui.settings.layersNudge.value} />
    </div>
  </div>

  <div class="row gap">
    <button onclick={(): void => context.ui.viewportManager.resetCameras()}
      >reset cameras</button>
  </div>
</div>

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

  .gap-after {
    margin-right: var(--form-gap);
  }

  .justify {
    justify-content: space-between;
  }

  .wide {
    width: 100%;
  }
</style>
