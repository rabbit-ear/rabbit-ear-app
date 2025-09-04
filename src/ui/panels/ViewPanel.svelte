<script lang="ts">
  import { untrack } from "svelte";
  import context from "../../app/context.svelte.ts";
  import t from "../../app/t.ts";
  import LogSlider from "../Components/LogSlider.svelte";
  import IconDetach from "../icons/selection-detach.svelte";
  import IconStretch from "../icons/selection-stretch.svelte";
  import IconPointer from "../icons/cursor-pointer.svelte";
  import IconPointerSnap from "../icons/cursor-pointer-snap.svelte";
  import IconHand from "../icons/cursor-hand.svelte";

  const formatNumber = (n: number) => {
    if (n === undefined) {
      return "";
    }
    const integer = Math.floor(n);
    return integer === n ? n : n.toFixed(2);
  };

  const formatPoint = (p: number[]) => p.map(formatNumber).join(", ");

  let layersNudgeSlider = $state(6);

  const viewportViews = $derived(
    context.ui.viewportManager.viewports.map((vp) => vp.view),
  );
  const viewportZooms = $derived(
    // viewportViews.map((v) => v.view[0] ?? 1).map(formatNumber),
    viewportViews.map((v) => v.zoom ?? 1).map(formatNumber),
  );
  const zooms = $derived(viewportZooms.join(" / "));
  let pointer = $state([0, 0]);
  let snapPoint = $state([0, 0]);

  const resetZoom = (): void => context.ui.viewportManager.resetCameras();

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
  {#if snapPoint === undefined}
    <div class="flex-row gap">
      <span class="svg-icon"><IconPointer /></span>
      <span class="number">{formatPoint(pointer)}</span>
    </div>
  {:else}
    <div class="flex-row gap">
      <span class="svg-icon"><IconPointerSnap /></span>
      <span class="number">{formatPoint(snapPoint)}</span>
    </div>
  {/if}
  <div class="flex-row gap">
    <button class="text-button flex-row gap" onclick={resetZoom}>
      <span class="svg-icon"><IconHand /></span>
      <span class="number">{zooms}</span>
    </button>
  </div>

  <hr />

  <div class="row toggle-row">
    <button
      class={context.ui.settings.selectionHandling.value === "detach"
        ? "svg-icon highlighted"
        : "svg-icon"}
      onclick={(): string => (context.ui.settings.selectionHandling.value = "detach")}
      ><IconDetach /></button>
    <button
      class={context.ui.settings.selectionHandling.value === "stretch"
        ? "svg-icon highlighted"
        : "svg-icon"}
      onclick={(): string => (context.ui.settings.selectionHandling.value = "stretch")}
      ><IconStretch /></button>
    <p class="gap-before">{context.ui.settings.selectionHandling.value}</p>
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

  <div class="row gap">
    <p>gap</p>
    <input
      type="range"
      min="1"
      max="20"
      step="0.01"
      id="slider-layer-nudge"
      bind:value={layersNudgeSlider} />
    <!-- <input -->
    <!--   type="text" -->
    <!--   class="long-input" -->
    <!--   bind:value={context.ui.settings.layersNudge.value} /> -->
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

  .gap-before {
    margin-left: var(--form-gap);
  }

  .justify {
    justify-content: space-between;
  }

  .wide {
    width: 100%;
  }

  button.text-button {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-weight: bold;
  }

  button.text-button:hover {
    color: var(--highlight);
  }

  button.text-button:focus {
    outline-offset: 2px;
    outline: 2px solid var(--ui-blue);
  }

  button.text-button > * {
    pointer-events: none;
  }

  .svg-icon {
    height: 1.75rem;
    width: 1.75rem;
    display: inline-block;
    padding: 0;
    /* background-color: transparent; */
    stroke: var(--text);
    fill: var(--text);
  }

  .svg-icon:hover {
    stroke: var(--bright);
    fill: var(--bright);
  }
</style>
