<script lang="ts">
  import settings from "./Settings/Settings.svelte.ts";

  //let { viewport }: { viewport: SVGViewport } = $props();
</script>

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
