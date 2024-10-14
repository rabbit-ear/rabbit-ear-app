<script lang="ts">
  import type { FrameViewport } from "./FrameViewport.svelte.ts";
  import Frames from "./Frames.svelte";

  type PropsType = {
    viewport: FrameViewport;
  };
  let { viewport }: PropsType = $props();
</script>

<svelte:window onkeyup={viewport.onkeyup} onkeydown={viewport.onkeydown} />

<div class="container">
  <Frames />
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
    min-width: 0;
    overflow: visible;
    position: relative;
  }
</style>
