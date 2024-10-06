<script lang="ts">
  import app from "../../app/App.svelte.ts";
  const viewports = $derived(app.ui?.viewports || []);
</script>

<div class="canvases row gap">
  {#each viewports as viewport}
    <div class="canvas">
      <viewport.component {viewport} />
    </div>
  {/each}
</div>

<style>
  .canvases {
    width: 100%;
    height: 100%;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .gap {
    gap: 3px;
  }

  /*component wrapper is required because svg and canvas elements have*/
  /*strange competing sizing rules when inside the same flexbox container*/
  .canvas {
    width: 100%;
    height: 100%;
    flex: 1 1 auto;
  }
</style>
