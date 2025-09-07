<script lang="ts">
  import { untrack } from "svelte";
  import context from "../../app/context.svelte.ts";
  import t from "../../app/t.ts";
  import { formatPoint, formatNumber } from "../../system/format.ts";
  import LogSlider from "../Components/LogSlider.svelte";
  import IconDetach from "../icons/select-detach.svelte";
  import IconStretch from "../icons/select-stretch.svelte";
  import IconPointer from "../icons/cursor-pointer.svelte";
  import IconPointerSnap from "../icons/cursor-pointer-snap.svelte";
  import IconHand from "../icons/cursor-hand.svelte";
  import IconSelectVertices from "../icons/select-vertices.svelte";
  import IconSelectEdges from "../icons/select-edges.svelte";
  import IconSelectFaces from "../icons/select-faces.svelte";

  const VEFSingular = $derived([
    t("math.graph.vertex"),
    t("math.graph.edge"),
    t("math.graph.face"),
  ]);

  const VEFPlural = $derived([
    t("math.graph.vertices"),
    t("math.graph.edges"),
    t("math.graph.faces"),
  ]);

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

  const selection = $derived(
    !context.fileManager.document?.data.selection
      ? undefined
      : [
          context.fileManager.document?.data.selection.vertices?.length,
          context.fileManager.document?.data.selection.edges?.length,
          context.fileManager.document?.data.selection.faces?.length,
        ]
          .map((count, i) => ({ count, i }))
          .filter((el) => el.count !== undefined && el.count !== 0)
          .map(({ count, i }) => ({
            count,
            name: count! > 1 ? VEFPlural[i] : VEFSingular[i],
          }))
          .map(({ count, name }) => `${count} ${name}`)
          .join(", "),
  );

  const selectVertices = $derived(context.ui.settings.selectionFilter.vertices.value);
  const selectEdges = $derived(context.ui.settings.selectionFilter.edges.value);
  const selectFaces = $derived(context.ui.settings.selectionFilter.faces.value);
  const selectComponent = $derived(
    [
      selectVertices ? VEFPlural[0] : undefined,
      selectEdges ? VEFPlural[1] : undefined,
      selectFaces ? VEFPlural[2] : undefined,
    ]
      .filter((a) => a !== undefined)
      .join(", "),
  );

  const toggleSelectionFilter = (component: string) => {
    const filter = context.ui.settings.selectionFilter;
    switch (component) {
      case "vertices":
        filter.vertices.value =
          !filter.edges.value && !filter.faces.value ? true : !filter.vertices.value;
        break;
      case "edges":
        filter.edges.value =
          !filter.vertices.value && !filter.faces.value ? true : !filter.edges.value;
        break;
      case "faces":
        filter.faces.value =
          !filter.vertices.value && !filter.edges.value ? true : !filter.faces.value;
        break;
      default:
        break;
    }
  };
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
    <button class="invisible flex-row gap" onclick={resetZoom}>
      <span class="svg-icon"><IconHand /></span>
      <span class="number">{zooms}</span>
    </button>
  </div>

  <hr />

  <div class="row">
    <p>select <span class="bold">{selectComponent}</span></p>
  </div>

  <div class="row center">
    <button
      class={[
        "invisible svg-icon large",
        selectVertices ? "highlighted" : undefined,
      ].join(" ")}
      onclick={() => toggleSelectionFilter("vertices")}><IconSelectVertices /></button>
    <button
      class={["invisible svg-icon large", selectEdges ? "highlighted" : undefined].join(
        " ",
      )}
      onclick={() => toggleSelectionFilter("edges")}><IconSelectEdges /></button>
    <button
      class={["invisible svg-icon large", selectFaces ? "highlighted" : undefined].join(
        " ",
      )}
      onclick={() => toggleSelectionFilter("faces")}><IconSelectFaces /></button>
  </div>

  <div class="row toggle-row">
    <p class="gap-after">inclusion</p>
    <button
      class={context.ui.settings.selectionInclusion.value === "loose"
        ? "highlighted"
        : ""}
      onclick={(): string => (context.ui.settings.selectionInclusion.value = "loose")}
      >loose</button>
    <button
      class={context.ui.settings.selectionInclusion.value === "strict"
        ? "highlighted"
        : ""}
      onclick={(): string => (context.ui.settings.selectionInclusion.value = "strict")}
      >strict</button>
  </div>

  <div class="row toggle-row">
    <p class="gap-after">on transform</p>
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
    <input
      type="checkbox"
      id="show-vertices"
      bind:checked={context.ui.settings.showVertices.value} />
    <label for="show-vertices">show {t("math.graph.vertices")}</label>
  </div>

  <div class="row gap">
    <p>gap</p>
    <LogSlider
      id="range-layer-nudge"
      radix={6}
      bind:value={context.ui.settings.layersNudge.value} />
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

  .center {
    justify-content: center;
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

  .invisible {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-weight: bold;
  }

  .bold {
    font-weight: bold;
  }

  .invisible:hover {
    color: var(--highlight);
  }

  .invisible:focus {
    outline-offset: 2px;
    outline: 2px solid var(--ui-blue);
  }

  .invisible > * {
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

  .svg-icon.large {
    height: 2.5rem;
    width: 2.5rem;
  }

  .svg-icon:hover {
    stroke: var(--bright);
    fill: var(--bright);
  }

  .svg-icon :global(.highlightable) {
    fill: var(--dim);
    stroke: var(--dim);
  }

  .svg-icon.highlighted :global(.highlightable) {
    /* fill: var(--highlight); */
    /* stroke: var(--highlight); */
    /* fill: var(--ui-blue); */
    /* stroke: var(--ui-blue); */
    fill: var(--bright);
    stroke: var(--bright);
  }
</style>
