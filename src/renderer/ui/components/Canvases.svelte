<script lang="ts">
  import app from "../../app/App.svelte.ts";
  const viewports = $derived(app.ui?.viewports || []);

  // hard coded the Terminal Viewport for now
  import { TerminalViewport } from "../viewport/TerminalViewport/TerminalViewport.svelte.ts";
  const terminalViewport = new TerminalViewport();

  import { FrameViewport } from "../viewport/FrameViewport/FrameViewport.svelte.ts";
  const frameViewport = new FrameViewport();
</script>

<div class="column">
  <div class="terminal">
    <terminalViewport.component viewport={terminalViewport} />
  </div>
  <div class="canvases row gap">
    {#each viewports as viewport}
      <div class="canvas">
        <viewport.component {viewport} />
      </div>
    {/each}
  </div>
  <div class="frames">
    <frameViewport.component viewport={frameViewport} />
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
    gap: 3px;
  }

  .canvases {
    height: calc(100vh - 8rem);
  }

  /*component wrapper is required because svg and canvas elements have*/
  /*strange competing sizing rules when inside the same flexbox container*/
  .canvas {
    flex: 1 1 auto;
  }

  /* hard coding the terminal viewport. could get rid of these later */
  .terminal {
    height: 8rem;
  }
  .frames {
    height: 8rem;
  }
</style>
