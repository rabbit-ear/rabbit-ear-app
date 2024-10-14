<script lang="ts">
  import FrameRender from "./FrameRender.svelte";
  import NewFrameButton from "./NewFrameButton.svelte";
  import app from "../../../app/App.svelte.js";

  const frames = app.file.geometry.frames;

  let pressIndex: number;
  let hoverIndex: number;

  const mousemove = (index: number): void => {
    hoverIndex = index;
  };

  const mousedown = (index: number): void => {
    pressIndex = index;
  };

  const mouseup = (index: number): void => {
    hoverIndex = index;
    if (
      pressIndex !== undefined &&
      hoverIndex !== undefined &&
      pressIndex >= 0 &&
      hoverIndex >= 0 &&
      !isNaN(hoverIndex) &&
      pressIndex !== hoverIndex
    ) {
      //app.invoker.executeCommand("moveFrameIndex", pressIndex, hoverIndex);
    }
    pressIndex = undefined;
    hoverIndex = undefined;
  };
</script>

<div class="frames horizontal" tabindex="-1" role="row">
  {#each frames as graph, index}
    <FrameRender {graph} {index} {mousedown} {mousemove} {mouseup} />
  {/each}
  <NewFrameButton />
</div>

<style>
  .frames {
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    overflow-x: auto;
    border-top: 2px solid var(--background-2);
    background-color: var(--background-1);
  }

  /* prevent the tab-selection outline on the frame container. */
  /* it doesn't make sense what it would be doing anyway. */
  .frames:focus-visible {
    outline: none;
  }

  .horizontal {
    display: flex;
    flex-direction: row;
    gap: 4px;
  }
</style>
