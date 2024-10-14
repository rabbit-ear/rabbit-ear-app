<script lang="ts">
  import FrameItem from "./FrameItem.svelte";
  import { DialogNewFrame } from "../../stores/App.js";
</script>

<FrameItem on:click={$DialogNewFrame.showModal()}>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <rect x="35" y="20" width="10" height="40" />
    <rect x="20" y="35" width="40" height="10" />
  </svg>
</FrameItem>

<style>
  svg {
    fill: var(--dim);
  }
  svg:hover {
    fill: var(--highlight);
  }
</style>
