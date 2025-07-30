<script lang="ts">
  import app from "../../state/app.svelte.ts";
  // import ViewportDropdown from "../panel/ViewportDropdown.svelte";
  const viewports = $derived(app.ui?.viewportManager?.viewports || []);
</script>

<div class="column">
  {#if app.ui?.viewports?.terminal}
    <div class="terminal">
      <app.ui.viewports.terminal.component viewport={app.ui.viewports.terminal} />
    </div>
  {/if}

  <div class="canvases row gap">
    {#each viewports as viewport, index}
      <div class="canvas">
        <!-- <ViewportDropdown {index} {viewport}> -->
        <!--   <viewport.panel {viewport} /> -->
        <!-- </ViewportDropdown> -->
        <viewport.component {viewport} />
      </div>
    {/each}
  </div>
</div>

<style>
  div {
    width: 100%;
    height: 100%;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .gap {
    gap: var(--form-gap);
  }

  .canvases {
    /* todo: this needs to be dynamically calculated based on */
    /* whether or not the terminal or frames is visible */
    /*height: calc(100vh - 6rem - 6rem);*/
    height: calc(100vh - 6rem);
  }

  /*component wrapper is required because svg and canvas elements have*/
  /*strange competing sizing rules when inside the same flexbox container*/
  .canvas {
    flex: 1 1 auto;
    position: relative;
  }

  /* hard coding the terminal viewport. could get rid of these later */
  .terminal {
    height: 6rem;
  }
</style>
