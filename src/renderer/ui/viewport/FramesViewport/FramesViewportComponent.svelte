<script lang="ts">
  import type { FramesViewport } from "./FramesViewport.svelte.ts";
  import NewFrameButton from "./NewFrameButton.svelte";
  import { showNewFrameModal } from "../../../app/Dialogs.svelte.ts";

  type PropsType = {
    viewport: FramesViewport;
  };
  let { viewport }: PropsType = $props();
</script>

<!--
<svelte:window onkeyup={viewport.onkeyup} onkeydown={viewport.onkeydown} />
-->

<div class="frames horizontal" tabindex="-1" role="row">
  {#each viewport.frames as frame}
    <frame.component {frame} {viewport} />
  {/each}
  <NewFrameButton onclick={showNewFrameModal} />
</div>

<style>
  .frames {
    width: 100%;
    height: 100%;
    min-width: 0;
    overflow-y: hidden;
    overflow-x: auto;
    position: relative;
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
