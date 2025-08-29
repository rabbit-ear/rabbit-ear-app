<script lang="ts">
  import Wrapper from "../Wrapper.svelte";
  import type { CreasePattern } from "./CreasePattern.svelte.ts";
  import { FrameClass } from "../Embedding.ts";

  const { embedding }: { embedding: CreasePattern } = $props();

  // embedding.userLocked;
  // embedding.attributeLocked;
  // embedding.locked;
  // const isCP = $derived(embedding.sourceIsCreasePattern);

  const frameClass = $derived(embedding.attributes.frameClass);
  const editable = $derived(embedding.editable);
  const frameLinked = $derived(embedding.frameLinked);

  // const isParent = $derived(embedding.attributes.isParent);
  // const isChild = $derived(embedding.attributes.isChild);

  const errors: string[] = $derived(embedding.errors ?? []);
</script>

{#snippet linked()}
  {#if frameLinked}
    <div class="row">
      <p>frame inherits or another inherits from it</p>
      <!-- {#if isParent && isChild} -->
      <!--   <p>frame is a parent and inherits from another</p> -->
      <!-- {:else if isParent} -->
      <!--   <p>frame is a parent to another</p> -->
      <!-- {:else if isChild} -->
      <!--   <p>frame inherits from another</p> -->
      <!-- {/if} -->
    </div>
  {/if}
{/snippet}

<Wrapper title="Crease Pattern">
  <div class="column gap">
    {@render linked()}
    <div class="row gap">
      {#if frameClass === FrameClass.creasePattern}
        <p>frame is a crease pattern</p>
      {:else}
        <p class="warning">frame is not a crease pattern</p>
      {/if}
    </div>
    {#each errors as error}
      <span class="error">{error}</span>
    {/each}
  </div>
</Wrapper>

<style>
  div {
    width: 100%;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .gap {
    gap: var(--form-gap);
  }

  .error {
    color: #e53;
  }

  .warning {
    color: var(--yellow);
  }
</style>
