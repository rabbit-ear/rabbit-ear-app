<script lang="ts">
  import Tools from "../tools/index.ts";
  import ToolbarButton from "./ToolbarButton.svelte";

  interface PropsType {
    tool: string;
    setTool: (tool: string) => void;
  }

  const { tool, setTool }: PropsType = $props();
</script>

<div class="grid-columns">
  {#each Object.values(Tools) as t}
    <ToolbarButton
      name={t.name}
      Icon={t.icon}
      onclick={() => setTool(t.name)}
      selected={tool === t.name} />
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
