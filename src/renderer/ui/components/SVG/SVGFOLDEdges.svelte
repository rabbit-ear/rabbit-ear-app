<script lang="ts">
  import type { FOLD } from "rabbit-ear/types.js";
  import type { SVGAttributes } from "svelte/elements";
  import { makeEdgesCoords } from "rabbit-ear/graph/make/edges.js";
  import { assignmentColor } from "rabbit-ear/fold/colors.js";

  type PropsType = {
    graph: FOLD;
  };

  const { graph }: PropsType & SVGAttributes<SVGGElement> = $props();

  const angleToOpacity = (angle: number): string =>
    angle === undefined ||
    angle === null ||
    angle === 0 ||
    angle === 180 ||
    angle === -180
      ? "1"
      : String(Math.abs(angle) / 180);

  const edges_vertices = $derived(graph.edges_vertices || []);
  const edges_assignment: string[] = $derived(
    edges_vertices
      .map((_, i) => graph.edges_assignment[i] || "U")
      .map((a) => assignmentColor[a]),
  );
  const edges_foldAngle: string[] = $derived(
    edges_vertices.map((_, i) => graph.edges_foldAngle[i]).map(angleToOpacity),
  );

  const lines = makeEdgesCoords(graph).map((s) => ({
    x1: s[0][0],
    y1: s[0][1],
    x2: s[1][0],
    y2: s[1][1],
  }));
</script>

{#each lines as line, i}
  <line {...line} class={edges_assignment[i]} opacity={edges_foldAngle[i]} />
{/each}

<style>
  .B,
  .b {
    stroke: "black";
  }

  .M,
  .m {
    stroke: "crimson";
  }

  .V,
  .v {
    stroke: "royalblue";
  }

  .F,
  .f {
    stroke: "lightgray";
  }

  .J,
  .j {
    stroke: "gold";
  }

  .C,
  .c {
    stroke: "limegreen";
  }

  .U,
  .u {
    stroke: "orchid";
  }
</style>
