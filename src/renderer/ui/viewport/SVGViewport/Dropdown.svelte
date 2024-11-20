<script lang="ts">
  import type { IModel } from "../../../model/Models.svelte.ts";
  import type { SVGViewpot } from "./SVGViewport.svelte.ts";
  import settings from "./Settings/Settings.svelte.ts";
  import app from "../../../app/App.svelte.ts";

  let { viewport }: { viewport: SVGViewport } = $props();
</script>

<div class="row toggle-row">
  {#each Object.entries(app.models.models) as [name, model]}
    <button
      class={viewport.model === model ? "highlighted" : ""}
      onclick={(): IModel => (viewport.model = model)}>{name}</button>
  {/each}
</div>

<div class="row toggle-row">
  <button
    class={settings.tiling === "triangle" ? "highlighted" : ""}
    onclick={(): string => (settings.tiling = "triangle")}>triangle</button>
  <button
    class={settings.tiling === "square" ? "highlighted" : ""}
    onclick={(): string => (settings.tiling = "square")}>rect</button>
</div>

<div class="row">
  <input type="checkbox" id="checkbox-show-grid" bind:checked={settings.showGrid} /><label
    for="checkbox-show-grid">show grid</label>
</div>

<div class="row">
  <input type="checkbox" id="checkbox-show-axes" bind:checked={settings.showAxes} /><label
    for="checkbox-show-axes">show axes</label>
</div>

<style>
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
