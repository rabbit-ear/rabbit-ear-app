<script lang="ts">
  import "../css/reset.css";
  import "../css/app.css";
  import "../css/form.css";
  import "../css/colors.css";
  import Toolbar from "./Toolbar.svelte";
  import Canvases from "./Canvases.svelte";
  import Panels from "./Panels.svelte";
  import context from "../../app/context.svelte.ts";
</script>

<main class="vertical">
  <div class="gui horizontal">
    <div class="toolbar" role="toolbar">
      <Toolbar
        tool={context.ui?.toolManager.toolName || ""}
        setTool={(tool: string) => context.ui?.toolManager.setToolWithName(tool)} />
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
