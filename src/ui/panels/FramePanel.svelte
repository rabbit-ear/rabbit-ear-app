<script lang="ts">
  import type { FOLD, FOLDChildFrame, FOLDFileMetadata } from "rabbit-ear/types.js";
  import context from "../../app/context.svelte.ts";

  let graphArrays: { [key: string]: [string, string] } = {
    vertices_vertices: ["v", "v"],
    vertices_edges: ["v", "e"],
    vertices_faces: ["v", "f"],
    edges_vertices: ["e", "v"],
    edges_faces: ["e", "f"],
    faces_vertices: ["f", "v"],
    faces_edges: ["f", "e"],
    faces_faces: ["f", "f"],
  };

  let attributeArrays: { [key: string]: [string] } = {
    vertices_coords: ["coords"],
    edges_assignment: ["assigns"],
    edges_foldAngle: ["angles"],
    faceOrders: ["face orders"],
  };

  let renderStyles: { [key: string]: string } = {
    creasePattern: "crease pattern",
    foldedForm: "folded form",
  };

  //let frameFlat = $derived(app.fileManager.models.frameFlat);
  //let hasFaceOrders = $derived(frame?.faceOrders && frame?.faceOrders.length);
  //let frameStyles = $derived(app.fileManager.file?.framesStyle);

  let activeFrameIndex = $derived(
    context.fileManager.activeDocument?.model.activeFrameIndex,
  );

  let frame: FOLDChildFrame | undefined = $derived(
    context.fileManager.activeDocument?.model.frame,
  );

  let frame_parent: number = $derived(frame?.frame_parent ?? 0);

  let hasParent: boolean = $derived(
    (frame?.frame_inherit && frame?.frame_parent != null) ?? false,
  );

  let frame_classes: string[] = $derived(frame?.frame_classes ?? []);

  let render_style = $derived(
    frame_classes.filter((cl) => renderStyles[cl]).map((cl) => renderStyles[cl]),
  );

  let graphBadges = $derived(
    Object.keys(graphArrays)
      .filter((key) => frame !== undefined && frame[key] != null)
      .map((key) => graphArrays[key].map((s: string) => s.toUpperCase()).join("•")),
  );

  let attributeBadges = $derived(
    Object.keys(attributeArrays)
      .filter((key) => frame !== undefined && frame[key] != null)
      .map((key) => attributeArrays[key].join("•")),
  );
</script>

<div class="column gap">
  <div class="row gap">
    <p>#{activeFrameIndex}</p>
    <p class="strong">{render_style}</p>
    <p>[{hasParent ? `child of #${frame_parent}` : "root"}]</p>
  </div>

  <div class="row">
    <p>attributes</p>
  </div>

  <div class="row sm-gap">
    {#each attributeBadges as name}
      <span class="badge">{name}</span>
    {/each}
  </div>

  <div class="row sm-gap">
    {#each graphBadges as name}
      <span class="badge">{name}</span>
    {/each}
  </div>
</div>

<style>
  p {
    pointer-events: none;
  }
  .gap {
    gap: var(--form-gap);
  }
  .sm-gap {
    gap: 3px;
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

  .badge {
    border: 1px solid var(--text);
    padding: 2px;
    border-radius: 3px;
  }

  .strong {
    font-weight: bold;
  }
</style>
