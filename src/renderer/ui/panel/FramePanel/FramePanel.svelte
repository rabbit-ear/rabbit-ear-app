<script lang="ts">
  import app from "../../../app/App.svelte.ts";

  //const classNames = { creasePattern: "crease pattern", foldedForm: "folded form" };

  let activeFrameIndex = $derived(app.models.activeFrameIndex);
  let frame = $derived(app.models.frame);
  //let frameFlat = $derived(app.models.frameFlat);

  //let frame_classes = $derived(frame?.frame_classes || []);
  let frame_parent = $derived(frame?.frame_parent);
  let hasParent = $derived(frame?.frame_inherit && frame?.frame_parent != null);

  let overrideVerticesCoords = $derived(hasParent && frame?.vertices_coords != null);
  let overrideEdgesAssignment = $derived(hasParent && frame?.edges_assignment != null);
  let overrideEdgesFoldAngle = $derived(hasParent && frame?.edges_foldAngle != null);

  //let frameStyles = $derived(app.fileManager.file?.framesStyle);
</script>

<div class="column gap">
  <div class="row">
    <p>frame {activeFrameIndex}</p>
  </div>
  {#if hasParent}
    <p>inherited (#{frame_parent})</p>
    <ul>
      {#if overrideVerticesCoords}
        <li>vertices coords</li>
      {/if}
      {#if overrideEdgesAssignment}
        <li>edges assignment</li>
      {/if}
      {#if overrideEdgesFoldAngle}
        <li>edges fold angle</li>
      {/if}
    </ul>
  {:else}
    <p>editable</p>
  {/if}
</div>

<style>
  p {
    pointer-events: none;
  }
  .gap {
    gap: var(--form-gap);
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  ul {
    list-style: disc;
    padding-left: 0.5rem;
  }
</style>
