<script>
  import Tools from "../tools/index.ts";
  import ToolbarButton from "./ToolbarButton.svelte";
</script>

<div class="grid-columns">
  {#each Object.values(Tools) as tool}
    <ToolbarButton name={tool.name} Icon={tool.icon} />
  {/each}
</div>

<style>
  .grid-columns {
    display: grid;
    grid-template-columns: 50% 50%;
    align-content: flex-start;
    position: relative;
  }
</style>
