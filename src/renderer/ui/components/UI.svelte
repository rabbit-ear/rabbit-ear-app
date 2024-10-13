<script lang="ts">
  import Toolbar from "./Toolbar.svelte";
  import Canvases from "./Canvases.svelte";
  import Panels from "./Panels.svelte";
  import app from "../../app/App.svelte.ts";
  import { UI as UIClass } from "../UI.svelte.ts";
  import { SVGViewport } from "../viewport/SVGViewport/SVGViewport.svelte.ts";
  import { WebGLViewport } from "../viewport/WebGLViewport/WebGLViewport.svelte.ts";

  // attach the UI to the app. from now on, app.ui is a valid property.
  app.ui = new UIClass();

  // initial set of viewports
  app.ui?.viewports.push(new SVGViewport(), new WebGLViewport());
</script>

<main class="vertical">
  <div class="gui horizontal">
    <div class="toolbar" role="toolbar">
      <Toolbar />
    </div>
    <div class="canvases">
      <Canvases />
    </div>
    <div class="panels">
      <Panels />
    </div>
  </div>
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
    position: fixed;
  }

  .vertical {
    display: flex;
    flex-direction: column;
  }

  .horizontal {
    display: flex;
    flex-direction: row;
  }

  /* main children: the top-most level */
  .gui {
    width: 100%;
    flex: 1 1 auto;
    min-height: 0;
  }

  /* .gui children */
  .toolbar {
    height: 100%;
    width: calc(2rem * 2 + 0.15rem * 4);
    flex: 0 0 auto;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .canvases {
    width: 100%;
    height: 100%;
    min-width: 0;
    flex: 1 1 auto;
  }

  .panels {
    height: 100%;
    width: 16rem;
    flex: 0 0 auto;
    overflow-x: hidden;
    overflow-y: auto;
  }

  /* colors */
  .toolbar {
    background-color: var(--background-1);
  }

  /* disable text-style drag and highlight on the buttons */
  .toolbar,
  .toolbar :global(*) {
    -webkit-user-select: none;
    user-select: none;
  }
</style>
