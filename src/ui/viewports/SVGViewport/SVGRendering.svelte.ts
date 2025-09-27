import { resize2 } from "rabbit-ear/math/vector.js";
import type { SVGViewport } from "./SVGViewport.svelte.ts";
import type { FOLD } from "rabbit-ear/types.js";
import { SvelteSet } from "svelte/reactivity";

const angleToOpacity = (angle?: number): string =>
  angle === undefined ||
    angle === null ||
    angle === 0 ||
    angle === 180 ||
    angle === -180
    ? "1"
    : String(Math.abs(angle) / 180);

// this class will watch for the SVGViewport's embedding's graph,
// build SVG Element definitions for the components of the graph,
// and trigger a reactive update of the graph when necessary.
export class SVGRendering {
  viewport: SVGViewport;

  graph: FOLD = $state({});

  // metadata
  showVertices = $derived.by(() => this.viewport.style.showVertices ?? false);
  showEdges = $derived.by(() => this.viewport.style.showEdges ?? true);
  showFaces = $derived.by(() => this.viewport.style.showFaces ?? true);

  file_classes = $derived(this.graph?.file_classes ?? []);
  frame_classes = $derived(this.graph?.frame_classes ?? []);
  className = $derived(this.file_classes.concat(this.frame_classes).join(" "));

  selectedVertices: SvelteSet<number> | undefined = $state();
  selectedEdges: SvelteSet<number> | undefined = $state();
  selectedFaces: SvelteSet<number> | undefined = $state();

  // vertices
  vertices_coords2: [number, number][] = $derived((this.graph?.vertices_coords ?? [])
    .map(resize2));
  // .map((points) => points.map((point) => point.map((n) => n.toFixed(4))))

  verticesClass: string[] = $derived((this.graph?.vertices_coords ?? [])
    .map((_, i) => [this.selectedVertices?.has(i) ? "selected" : undefined])
    .map(arr => arr.filter(a => a !== undefined).join(" ")));

  // edges
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

  edgesClass: string[] = $derived((this.graph?.edges_vertices ?? [])
    .map((_, i) => [
      this.edgesAssignments[i],
      this.selectedEdges?.has(i) ? "selected" : undefined,
    ])
    .map(arr => arr.filter(a => a !== undefined).join(" ")));

  // faces
  facesCoords: [number, number][][] = $derived((this.graph?.faces_vertices ?? [])
    .map((fv) => (fv ?? []).map(v => this.vertices_coords2[v] ?? [0, 0])));

  facesPoints: string[] = $derived(this.facesCoords
    .map((points) => points.map((point) => point.join(",")).join(" ")));

  facesSide: boolean[] = $derived((this.graph?.faces_vertices ?? [])
    .map(() => true));

  facesClass: string[] = $derived((this.graph?.faces_vertices ?? [])
    .map((_, i) => [
      this.facesSide[i] ? "front" : undefined,
      this.selectedFaces?.has(i) ? "selected" : undefined,
    ])
    .map(arr => arr.filter(a => a !== undefined).join(" ")));

  // renderable components
  vertices: { cx: number, cy: number }[] = $derived(this.vertices_coords2
    .map(([cx, cy], i) => ({ cx, cy, class: this.verticesClass[i] })));

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
      class: this.edgesClass[i],
      opacity: this.edgesOpacities[i] ?? "1",
    })));

  faces: { points: string, class: string }[] = $derived(this.facesPoints
    .map((points, i) => ({ points, class: this.facesClass[i] })));

  #effects: (() => void)[] = [];

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
    this.#effects = [
      this.#effectGraph(),
      this.#effectSetSelection(),
      this.#effectSetEdgesAttributes(),
    ];
  }

  dealloc(): void {
    this.#effects.forEach(fn => fn());
  }

  #effectGraph(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = [
          // everything except for selection, and from isomorphic only coords
          this.viewport.embedding,
          this.viewport.embedding?.embeddingUpdate?.structural,
          this.viewport.embedding?.embeddingUpdate?.isomorphic.coords,
          this.viewport.embedding?.embeddingUpdate?.reset,
        ];
        console.log("SVGRendering(): update graph");
        this.graph = this.viewport.embedding?.graph ? { ...this.viewport.embedding?.graph } : {};
      });
      return () => { };
    });
  }

  #effectSetEdgesAttributes(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = [
          this.viewport.embedding?.embeddingUpdate?.isomorphic.assignments,
          this.viewport.embedding?.embeddingUpdate?.isomorphic.foldAngles,
        ];
        console.log("SVGRendering(): update edge attributes");
        const graph = this.viewport.embedding?.graph;
        this.edgesAssignments = (graph?.edges_vertices ?? [])
          .map((_, i) => graph?.edges_assignment?.[i] ?? "U");
        this.edgesOpacities = (graph?.edges_vertices ?? [])
          .map((_, i) => graph?.edges_foldAngle?.[i])
          .map(angleToOpacity);
      });
      return () => { };
    });
  }

  #effectSetSelection(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = [
          this.viewport.embedding?.embeddingUpdate?.selection,
        ];
        console.log("SVGRendering(): update selection");
        this.selectedVertices = new SvelteSet(this.viewport.embedding?.selection?.vertices);
        this.selectedEdges = new SvelteSet(this.viewport.embedding?.selection?.edges);
        this.selectedFaces = new SvelteSet(this.viewport.embedding?.selection?.faces);
      });
      return () => { };
    });
  }
}
