<script lang="ts">
  import type { CreasePattern } from "./CreasePattern.svelte.ts";
  import Wrapper from "../Wrapper.svelte";
  import { FrameClass } from "../FrameAttributes.ts";

  const { embedding }: { embedding: CreasePattern } = $props();

  // embedding.userLocked;
  // embedding.attributeLocked;
  // embedding.locked;
  const isCP = $derived(embedding.attributes.class === FrameClass.creasePattern);
  const editable = $derived(embedding.editable);
  const frameLinked = $derived(embedding.frameLinked);

  // const isParent = $derived(embedding.attributes.isParent);
  // const isChild = $derived(embedding.attributes.isChild);

  const errors: string[] = $derived(embedding.errors ?? []);
</script>

{#snippet linked()}
  {#if frameLinked}
    <div class="row">
      <p class="warning">linked</p>
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
    {#if !isCP}
      <div class="row gap">
        <p class="warning">frame is not a crease pattern</p>
      </div>
    {/if}
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
    color: var(--red);
  }

  .warning {
    color: var(--yellow);
  }
</style>
