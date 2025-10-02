import type { WebGLViewport } from "./WebGLViewport.svelte.ts";
import type { FOLD } from "rabbit-ear/types.js";
import earcut from "earcut";
import { SvelteSet } from "svelte/reactivity";
import { subtract2 } from "rabbit-ear/math/vector.js";
import { light, dark } from "rabbit-ear/webgl/general/colors.js";
import { makeEdgesFoldAngle } from "rabbit-ear/graph/make/edgesFoldAngle.js";
import { triangulateConvexFacesVertices, triangulateNonConvexFacesVertices } from "rabbit-ear/graph/triangulate.js";

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
export class WebGLRenderingCP {
  viewport: WebGLViewport;

  // the source graph on the embedding will be processed before being set to here.
  // these two graphs are not isomorphic (source and this one for rendering).
  // (faces will be triangulated and exploded and cuts will be processed)
  graph: FOLD = $state({});

  // this graph for rendering and the source graph are not isomorphic,
  // this maps this graph's vertices (index) to the vertex index from
  // the source graph (value).
  #mapping: { vertices?: number[][], edges?: number[][], faces: number[][] } | undefined = $state();

  // style data
  assignmentsColor: { [key: string]: number[] } = $derived.by(() => ({
    ...(this.viewport.style.darkMode ? dark : light),
    "selected": [1, 187 / 255, 68 / 255],
  }));

  selectedVertices: SvelteSet<number> | undefined = $state();
  selectedEdges: SvelteSet<number> | undefined = $state();
  selectedFaces: SvelteSet<number> | undefined = $state();

  verticesSelected: boolean[] = $derived((this.graph?.vertices_coords ?? [])
    .map((_, i) => this.selectedVertices?.has(i) ?? false));

  edgesSelected: boolean[] = $derived((this.graph?.edges_vertices ?? [])
    .map((_, i) => this.selectedEdges?.has(i) ?? false));

  facesSelected: boolean[] = $derived((this.graph?.faces_vertices ?? [])
    .map((_, i) => this.selectedFaces?.has(i) ?? false));

  // vertices
  vertices_coords2: [number, number][] = $derived((this.graph?.vertices_coords ?? [])
    .map(coord => [coord[0] ?? 0, coord[1] ?? 0]));

  // edges
  edgesCoords2: [[number, number], [number, number]][] = $derived((this.graph?.edges_vertices ?? [])
    .map((ev) => [
      this.vertices_coords2[ev[0]] ?? [0, 0],
      this.vertices_coords2[ev[1]] ?? [0, 0],
    ]));

  // for every edge, one 2D vector
  edgesVector2 = $derived(this.edgesCoords2.map(([a, b]) => subtract2(b, a)));

  edgesAssignments: string[] = $derived((this.graph?.edges_vertices ?? [])
    .map((_, i) => this.graph?.edges_assignment?.[i] ?? "U"));

  edgesOpacities: string[] = $derived((this.graph?.edges_vertices ?? [])
    .map((_, i) => this.graph?.edges_foldAngle?.[i])
    .map(angleToOpacity));

  thickEdgesVerticesCoords = $derived((this.graph.edges_vertices ?? [])
    .flatMap((edge) => edge.map((v) => this.vertices_coords2?.[v] ?? [0, 0]))
    .flatMap((coord) => [coord, coord]));

  // in this upcoming section, we gather 4 vertices for every edge.
  // these vertices will be used to form a very long thin rectangle (2 triangles)
  // for every edge, 4 color values for each vertex of the rectangle
  thickEdgesVerticesColor = $derived((this.graph.edges_assignment ?? [])
    .map((assignment, i) => this.selectedEdges?.has(i) ? "selected" : assignment)
    .flatMap((a) => Array(4).fill(this.assignmentsColor[a] ?? [1, 1, 1])));

  // for every edge, 4 opacity values for each vertex of the rectangle
  edgesVerticesFoldAngle = $derived((this.graph.edges_foldAngle ?? [])
    .flatMap((a) => Array(4).fill(a)));

  // for every edge, 4 identical copies of the edge's vector
  thickEdgesVerticesEdgesVector = $derived(this.edgesVector2
    .flatMap((el) => Array(4).fill(el)));

  // the rectangle's vertices are arranged counter clockwise,
  // these values indicate where along the edge this vertex lies.
  thickEdgesVerticesVector = $derived((this.graph.edges_vertices ?? [])
    .flatMap(() => [[1, 0], [-1, 0], [-1, 0], [1, 0]]));

  // faces
  facesCoords2: [number, number][][] = $derived((this.graph?.faces_vertices ?? [])
    .map((fv) => (fv ?? []).map(v => this.vertices_coords2[v] ?? [0, 0])));

  facesColor: (string | [number, number, number])[] = $derived((this.graph.faces_vertices ?? [])
    .map((_, i) => this.selectedFaces?.has(i) ? [1, 1, 1] : this.viewport.style.cpColor));

  // renderable components
  // thick edges
  vertexArrayThickEdgesVerticesCoords = $derived(new Float32Array(this.thickEdgesVerticesCoords.flat()));
  vertexArrayThickEdgesVerticesColor = $derived(new Float32Array(this.thickEdgesVerticesColor.flat()));
  vertexArrayThickEdgesVerticesEdgesVector = $derived(new Float32Array(this.thickEdgesVerticesEdgesVector.flat()));
  vertexArrayThickEdgesVerticesFoldAngle = $derived(new Float32Array(this.edgesVerticesFoldAngle.flat()));
  vertexArrayThickEdgesVerticesVector = $derived(new Float32Array(this.thickEdgesVerticesVector.flat()));

  elementArrayThickEdges: Uint16Array | Uint32Array = $derived.by(() => {
    const edgesTriangles = (this.graph.edges_vertices ?? [])
      .map((_, i) => i * 4)
      .flatMap((i) => [i + 0, i + 1, i + 2, i + 2, i + 3, i + 0]);
    return this.viewport.version === 2
      ? new Uint32Array(edgesTriangles)
      : new Uint16Array(edgesTriangles);
  });

  // renderable components
  // faces
  vertexArrayVerticesCoords: Float32Array = $derived(new Float32Array(this.vertices_coords2.flat()));

  elementArrayFaces: Uint16Array | Uint32Array = $derived.by(() => this.viewport.version === 2
    ? new Uint32Array(this.graph.faces_vertices?.flat() ?? [])
    : new Uint16Array(this.graph.faces_vertices?.flat() ?? []));

  #effects: (() => void)[] = [];

  constructor(viewport: WebGLViewport) {
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

  #processGraph(graph: FOLD): {
    graph: FOLD,
    changes: { vertices?: number[][], edges?: number[][], faces: number[][] } | undefined,
  } {
    if (!graph.vertices_coords || !graph.edges_vertices) {
      return { graph: {}, changes: { faces: [] } };
    }

    // build new triangulated faces_vertices. faces are allowed to not-exist, (empty array).
    // calculate faces' next map
    let newFaceIndex = 0;
    const facesNextMap = (graph.faces_vertices ?? [])
      .map((verts) => Math.max(3, verts.length))
      .map((length) => Array.from(Array(length - 2)).map(() => newFaceIndex++));
    let faces_vertices: number[][] = [];
    try {
      faces_vertices = earcut
        ? triangulateNonConvexFacesVertices(graph, earcut)
        : triangulateConvexFacesVertices(graph);
    } catch {
      faces_vertices = [];
    }

    // assignment, fold angle
    const edges_assignment = graph.edges_assignment
      ? graph.edges_assignment
      : graph.edges_vertices.map(() => "U");

    const edges_foldAngle = graph.edges_foldAngle
      ? graph.edges_foldAngle
      : makeEdgesFoldAngle({ edges_assignment });

    const result: FOLD = {
      vertices_coords: graph.vertices_coords,
      edges_vertices: graph.edges_vertices,
      edges_assignment,
      edges_foldAngle,
      faces_vertices,
    };

    return { graph: result, changes: { faces: facesNextMap } };
  }

  #effectGraph(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = [
          // everything except for selection, and from isomorphic only coords
          this.viewport.embedding,
          this.viewport.embedding?.embeddingUpdate?.reset,
          this.viewport.embedding?.embeddingUpdate?.structural,
          this.viewport.embedding?.embeddingUpdate?.isomorphic.coords,
        ];
        console.log("WebGLRendering(): CP: update graph");
        try {
          const { graph, changes } = this.#processGraph(this.viewport.embedding?.graph ?? {});
          this.graph = graph;
          this.#mapping = changes;
        } catch {
          this.graph = {};
        }
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
        console.log("WebGLRendering(): CP: update edge attributes");
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
        console.log("WebGLRendering(): CP: update selection");
        this.selectedVertices = new SvelteSet(this.viewport.embedding?.selection?.vertices);
        this.selectedEdges = new SvelteSet(this.viewport.embedding?.selection?.edges);
        this.selectedFaces = new SvelteSet(this.viewport.embedding?.selection?.faces);
      });
      return () => { };
    });
  }
}

