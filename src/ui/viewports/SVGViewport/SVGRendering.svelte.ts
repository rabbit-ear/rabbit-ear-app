import { resize2 } from "rabbit-ear/math/vector.js";
import type { SVGViewport } from "./SVGViewport.svelte.ts";

const angleToOpacity = (angle?: number): string =>
  angle === undefined ||
    angle === null ||
    angle === 0 ||
    angle === 180 ||
    angle === -180
    ? "1"
    : String(Math.abs(angle) / 180);

export class SVGRendering {
  viewport: SVGViewport;

  graph = $state({});
  // graph = $derived.by(() => {
  //   const _ = [
  //     this.viewport.embeddingUpdate?.reset,
  //     this.viewport.embeddingUpdate?.isomorphic,
  //     this.viewport.embeddingUpdate?.structural,
  //   ];
  //   console.log("refreshing SVG Rendering's graph");
  //   return this.viewport.embedding?.graph;
  // });

  // metadata
  showVertices = $derived.by(() => this.viewport.style.showVertices ?? false);
  showEdges = $derived.by(() => this.viewport.style.showEdges ?? true);
  showFaces = $derived.by(() => this.viewport.style.showFaces ?? true);

  file_classes = $derived(this.graph?.file_classes ?? []);
  frame_classes = $derived(this.graph?.frame_classes ?? []);
  className = $derived(this.file_classes.concat(this.frame_classes).join(" "));

  // vertices
  vertices_coords2: [number, number][] = $derived((this.graph?.vertices_coords ?? [])
    .map(resize2));
  // .map((points) => points.map((point) => point.map((n) => n.toFixed(4))))

  // edges
  edges_vertices = $derived(this.graph?.edges_vertices ?? []);
  edges_assignment = $derived(this.graph?.edges_assignment ?? []);
  edges_foldAngle = $derived(this.graph?.edges_foldAngle ?? []);

  edgesCoords: [[number, number], [number, number]][] = $derived((this.graph?.edges_vertices ?? [])
    .map((ev) => [this.vertices_coords2[ev[0]] ?? [0, 0], this.vertices_coords2[ev[1]] ?? [0, 0]]));

  edgesAssignments: string[] = $derived((this.graph?.edges_vertices ?? [])
    .map((_, i) => this.graph?.edges_assignment?.[i] ?? "U"));

  // todo: might be faster for rendering if we removed all opacity 1 entries
  edgesOpacities: string[] = $derived((this.graph?.edges_vertices ?? [])
    .map((_, i) => this.graph?.edges_foldAngle?.[i])
    .map(angleToOpacity));

  edgesLines: { x1: number, y1: number, x2: number, y2: number }[] = $derived(this.edgesCoords
    .map((s) => ({ x1: s[0][0], y1: s[0][1], x2: s[1][0], y2: s[1][1] })));

  // faces
  facesCoords: [number, number][][] = $derived((this.graph?.faces_vertices ?? [])
    .map((fv) => (fv ?? []).map(v => this.vertices_coords2[v] ?? [0, 0])));

  facesPoints: string[] = $derived(this.facesCoords
    .map((points) => points.map((point) => point.join(",")).join(" ")));

  facesSide: string[] = $derived((this.graph?.faces_vertices ?? [])
    .map(() => "front"));

  // renderable components
  vertices: { cx: number, cy: number }[] = $derived(this.vertices_coords2
    .map(([cx, cy]) => ({ cx, cy })));

  edges: {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    class: string,
    opacity: string,
  }[] = $derived(this.edgesLines
    .map((el, i) => ({
      ...el,
      class: this.edgesAssignments[i] ?? "U",
      opacity: this.edgesOpacities[i] ?? "1",
    })));

  faces: { points: string, class: string }[] = $derived(this.facesPoints
    .map((points, i) => ({ points, class: this.facesSide[i] ?? "front" })));

  #effects: (() => void)[] = [];

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
    this.#effects = [this.#effectGraph()];
  }

  dealloc(): void {
    this.#effects.forEach(fn => fn());
  }

  #effectGraph(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = [
          // viewport.graphUpdate?.structural;
          // viewport.graphUpdate?.isomorphic;
          // viewport.graphUpdate?.reset;
          this.viewport.embedding?.embeddingUpdate?.structural,
          this.viewport.embedding?.embeddingUpdate?.isomorphic,
          this.viewport.embedding?.embeddingUpdate?.reset,
        ];
        this.graph = { ...this.viewport.embedding?.graph };
      });
      return () => { };
    })
  }
}
