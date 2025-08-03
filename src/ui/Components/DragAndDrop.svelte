<script lang="ts">
  import context from "../../app/context.svelte.ts";
</script>

<svelte:body {ondragenter} {ondragleave} {ondragover} {ondrop} />

<div class={context.dragIsHovering ? "hovering" : ""}></div>

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
