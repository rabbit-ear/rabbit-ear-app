<script lang="ts">
  import { fileDropDidUpdate } from "../../interface/dropFile.svelte.ts";

  let isHovering = $state(false);

  const ondragenter = (e: DragEvent): void => {
    e.preventDefault();
    isHovering = true;
  };

  const ondragleave = (e: DragEvent): void => {
    e.preventDefault();
    isHovering = false;
  };

  const ondragover = (e: DragEvent): void => {
    e.preventDefault();
    isHovering = true;
  };

  const ondrop = (event: DragEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    isHovering = false;
    fileDropDidUpdate(event);
  };
</script>

<svelte:body {ondragenter} {ondragleave} {ondragover} {ondrop} />

<div class={isHovering ? "hovering" : ""}></div>

<!-- {#if isHovering}<div class="hovering"></div>{/if} -->

<style>
  div {
    width: 100vw;
    height: 100%;
    min-height: 100vh;
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    outline: none;
    border: 3px solid transparent;
    background-color: transparent;
    border-radius: 0.25rem;
    transition: all 0.15s;
  }

  .hovering {
    background-color: #fff1;
    border-color: #fff;
  }
</style>
