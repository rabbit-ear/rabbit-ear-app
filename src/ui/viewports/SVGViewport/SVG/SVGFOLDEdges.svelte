<script lang="ts">
  import { resize2 } from "rabbit-ear/math/vector.js";
  import type { FOLD } from "rabbit-ear/types.js";
  //import { makeEdgesCoords } from "rabbit-ear/graph/make/edges.js";

  type PropsType = {
    graph?: FOLD;
  };

  const { graph = {} }: PropsType = $props();

  //const makeEdgesCoords = (
  //  g: FOLD,
  //): (
  //  | [[number, number], [number, number]]
  //  | [[number, number, number], [number, number, number]]
  //)[] =>
  //  g.edges_vertices && g.vertices_coords
  //    ? (g.edges_vertices || [])
  //        .map((ev) => [g.vertices_coords[ev[0]], g.vertices_coords[ev[1]]])
  //        .filter(([p, q]) => p !== undefined && q !== undefined)
  //    : [];

  const makeEdgesCoords = (g: FOLD): [[number, number], [number, number]][] => {
    if (!g.edges_vertices || !g.vertices_coords) {
      return [];
    }
    const edges_coords = (g.edges_vertices || []).map((ev) => [
      g.vertices_coords[ev[0]],
      g.vertices_coords[ev[1]],
    ]);
    return edges_coords
      .filter(([p, q]) => p !== undefined && q !== undefined)
      .map(([a, b]) => [resize2(a), resize2(b)] as [[number, number], [number, number]]);
  };

  const angleToOpacity = (angle: number): string =>
    angle === undefined ||
    angle === null ||
    angle === 0 ||
    angle === 180 ||
    angle === -180
      ? "1"
      : String(Math.abs(angle) / 180);

  const edges_vertices = $derived(graph.edges_vertices || []);
  const edges_assignment = $derived(graph.edges_assignment || []);
  const edges_foldAngle = $derived(graph.edges_foldAngle || []);

  const lines = $derived(
    makeEdgesCoords(graph).map((s) => ({
      x1: s[0][0],
      y1: s[0][1],
      x2: s[1][0],
      y2: s[1][1],
    })),
  );

  const classes: string[] = $derived(
    edges_vertices.map((_, i) => edges_assignment[i] || "U"),
  );

  const opacities: string[] = $derived(
    edges_vertices.map((_, i) => edges_foldAngle[i]).map(angleToOpacity),
  );
</script>

{#each lines as line, i}
  <line {...line} class={classes[i]} opacity={opacities[i]} />
{/each}

<style>
  .B,
  .b {
    stroke: darkgray;
  }

  .M,
  .m {
    stroke: crimson;
  }

  .V,
  .v {
    stroke: royalblue;
  }

  .F,
  .f {
    stroke: #555;
  }

  .J,
  .j {
    stroke: gold;
  }

  .C,
  .c {
    stroke: limegreen;
  }

  .U,
  .u {
    stroke: orchid;
  }

  :global(.selection),
  :global(.selection) .B,
  :global(.selection) .b,
  :global(.selection) .M,
  :global(.selection) .m,
  :global(.selection) .V,
  :global(.selection) .v,
  :global(.selection) .F,
  :global(.selection) .f,
  :global(.selection) .J,
  :global(.selection) .j,
  :global(.selection) .C,
  :global(.selection) .c,
  :global(.selection) .U,
  :global(.selection) .u {
    stroke: var(--yellow);
  }
</style>
