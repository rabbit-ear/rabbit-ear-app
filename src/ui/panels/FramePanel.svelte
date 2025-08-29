<script lang="ts">
  import type { FOLDChildFrame } from "rabbit-ear/types.js";
  import context from "../../app/context.svelte.ts";
  import type { FrameAttributes } from "../../graphs/FrameAttributes.ts";

  const graphArrays: { [key: string]: [string, string] } = {
    vertices_vertices: ["v", "v"],
    vertices_edges: ["v", "e"],
    vertices_faces: ["v", "f"],
    edges_vertices: ["e", "v"],
    edges_faces: ["e", "f"],
    faces_vertices: ["f", "v"],
    faces_edges: ["f", "e"],
    faces_faces: ["f", "f"],
  };

  const attributeArrays: { [key: string]: [string] } = {
    vertices_coords: ["V•coords"],
    edges_assignment: ["E•assigns"],
    edges_foldAngle: ["E•angles"],
    faceOrders: ["F•orders"],
  };

  const renderStyles: { [key: string]: string } = {
    creasePattern: "crease pattern",
    foldedForm: "folded form",
  };

  //let frameFlat = $derived(app.fileManager.models.frameFlat);
  //let hasFaceOrders = $derived(frame?.faceOrders && frame?.faceOrders.length);
  //let frameStyles = $derived(app.fileManager.file?.framesStyle);

  const source: FOLDChildFrame | undefined = $derived(
    context.fileManager.document?.data.frame.source,
  );

  const attributes: FrameAttributes | undefined = $derived(
    context.fileManager.document?.data.frame.attributes,
  );

  const frameIndex = $derived(context.fileManager.document?.data.frameIndex);

  const frame_parent: number = $derived(source?.frame_parent ?? 0);

  const hasParent: boolean = $derived(attributes?.hasParent ?? false);

  const render_style = $derived(
    attributes?.class ? renderStyles[attributes.class] : "creasePattern",
  );

  const graphBadges = $derived(
    Object.keys(graphArrays)
      .filter((key) => source !== undefined && source[key] != null)
      .map((key) => graphArrays[key].map((s: string) => s.toUpperCase()).join("•")),
  );

  const attributeBadges = $derived(
    Object.keys(attributeArrays)
      .filter((key) => source !== undefined && source[key] != null)
      .map((key) => attributeArrays[key]),
  );
</script>

<div class="column gap">
  <div class="row gap">
    <p>#{frameIndex}</p>
    <p class="strong">{render_style}</p>
    <p>[{hasParent ? `inherits from #${frame_parent}` : "root"}]</p>
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
