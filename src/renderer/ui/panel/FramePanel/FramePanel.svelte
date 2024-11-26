<script lang="ts">
  import app from "../../../app/App.svelte.ts";

  let graphArrays = {
    vertices_vertices: ["v", "v"],
    vertices_edges: ["v", "e"],
    vertices_faces: ["v", "f"],
    edges_vertices: ["e", "v"],
    edges_faces: ["e", "f"],
    faces_vertices: ["f", "v"],
    faces_edges: ["f", "e"],
    faces_faces: ["f", "f"],
  };

  let attributeArrays = {
    vertices_coords: ["coords"],
    edges_assignment: ["assigns"],
    edges_foldAngle: ["angles"],
    faceOrders: ["face orders"],
  };

  let renderStyles = {
    creasePattern: "crease pattern",
    foldedForm: "folded form",
  };

  //const classNames = { creasePattern: "crease pattern", foldedForm: "folded form" };

  let activeFrameIndex = $derived(app.models.activeFrameIndex);
  let frame = $derived(app.models.frame);
  //let frameFlat = $derived(app.models.frameFlat);

  //let frame_classes = $derived(frame?.frame_classes || []);
  let frame_parent = $derived(frame?.frame_parent);
  let hasParent = $derived(frame?.frame_inherit && frame?.frame_parent != null);
  //let hasFaceOrders = $derived(frame?.faceOrders && frame?.faceOrders.length);

  let frame_classes = $derived(frame.frame_classes || []);
  let render_style = $derived(
    frame_classes.filter((cl) => renderStyles[cl]).map((cl) => renderStyles[cl]),
  );

  //let frameStyles = $derived(app.fileManager.file?.framesStyle);

  let graphBadges = $derived(
    Object.keys(graphArrays)
      .filter((key) => frame[key] != null)
      .map((key) => graphArrays[key].map((s: string) => s.toUpperCase()).join("•")),
  );

  let attributeBadges = $derived(
    Object.keys(attributeArrays)
      .filter((key) => frame[key] != null)
      .map((key) => attributeArrays[key].join("•")),
  );
</script>

<div class="column gap">
  <div class="row gap">
    <p>#{activeFrameIndex}</p>
    <p class="strong">{render_style}</p>
    <p>[{hasParent ? `child of #${frame_parent}` : "root"}]</p>
  </div>

  <div class="row sm-gap">
    {#each graphBadges as name}
      <span class="badge">{name}</span>
    {/each}
  </div>

  <!--
  <div class="row">
    <p>attributes</p>
  </div>
  -->
  <div class="row sm-gap">
    {#each attributeBadges as name}
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
