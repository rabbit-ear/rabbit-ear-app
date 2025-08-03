<script lang="ts">
  import type { Component } from "svelte";
  import Wrapper from "../panels/Wrapper.svelte";
  import context from "../../app/context.svelte.ts";

  type PanelType = { name: string; component: Component };

  // const panels: Component[] = $derived(app.ui?.panels.components);
  // const props: { name: string }[] = $derived(app.ui?.panels.props);

  // const panels: Component[] = [];
  // const panels: PanelType[] = $derived(context.ui?.panelManager.viewportPanels);
  const panels: PanelType[] = $derived(context.ui?.panelManager.panels);

  // $effect(() => {
  //   console.log("all static panels", context.ui?.panelManager.allStaticPanels);
  //   console.log("all static panels[0]", context.ui?.panelManager.allStaticPanels[0]);
  // });

  // $effect(() => {
  //   console.log("static panels", context.ui?.panelManager.staticPanels);
  //   console.log("static panels[0]", context.ui?.panelManager.staticPanels[0]);
  //   console.log(
  //     "static panels[0].name",
  //     context.ui?.panelManager.staticPanels[0].panelName,
  //   );
  //   console.log(
  //     "static panels[0].constructor",
  //     context.ui?.panelManager.staticPanels[0].constructor,
  //   );
  // });
</script>

<!-- <div class="column"> -->
<!--   {#each panels as Panel, i} -->
<!--     <Wrapper title={props?.[i]?.name}> -->
<!--       <Panel {...props} /> -->
<!--     </Wrapper> -->
<!--   {/each} -->
<!-- </div> -->

<div class="column">
  {#each panels as panel}
    <Wrapper title={panel.name}>
      <panel.component />
    </Wrapper>
  {/each}
</div>

<style>
  div {
    width: 100%;
    height: 100%;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.25rem;
  }

  /*gap is accomplished by each Wrapper's margin, this also gives margin at the top*/
  /*.gap {*/
  /*  gap: var(--form-gap);*/
  /*}*/
</style>
