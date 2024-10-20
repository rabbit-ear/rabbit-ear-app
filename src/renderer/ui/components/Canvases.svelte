<script lang="ts">
  import app from "../../app/App.svelte.ts";
  import ViewportSettings from "./ViewportSettings.svelte";
  const viewports = $derived(app.ui?.viewports || []);
</script>

<div class="column">
  {#if app.ui?.terminalViewport}
    <div class="terminal">
      <app.ui.terminalViewport.component viewport={app.ui.terminalViewport} />
    </div>
  {/if}

  <div class="canvases row gap">
    {#each viewports as viewport, index}
      <div class="canvas">
        <ViewportSettings {index} {viewport} panel={viewport.panel} />
        <viewport.component {viewport} />
      </div>
    {/each}
  </div>

  {#if app.ui?.framesViewport}
    <div class="frames">
      <app.ui.framesViewport.component viewport={app.ui.framesViewport} />
    </div>
  {/if}
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
    height: calc(100vh - 8rem - 6rem);
  }

  /*component wrapper is required because svg and canvas elements have*/
  /*strange competing sizing rules when inside the same flexbox container*/
  .canvas {
    flex: 1 1 auto;
    position: relative;
  }

  /* hard coding the terminal viewport. could get rid of these later */
  .terminal {
    height: 8rem;
  }
  .frames {
    height: 6rem;
  }
</style>
