import type { WebGLViewport } from "./WebGLViewport.svelte.ts";
import type { FOLD } from "rabbit-ear/types.js";
import earcut from "earcut";
import { SvelteSet } from "svelte/reactivity";
import { cross3, normalize3, parallel, subtract2, subtract3 } from "rabbit-ear/math/vector.js";
import { light, dark } from "rabbit-ear/webgl/general/colors.js";
import { makeVerticesFacesSimple, makeVerticesNormal } from "../../../general/fold.ts";
import { makeFacesEdgesFromVertices } from "rabbit-ear/graph/make/facesEdges.js";
import { prepareForRendering } from "./GLModels/rendering.ts";
import { makeEdgesFoldAngle } from "rabbit-ear/graph/make/edgesFoldAngle.js";

// this class will watch for the SVGViewport's embedding's graph,
// build SVG Element definitions for the components of the graph,
// and trigger a reactive update of the graph when necessary.
export class WebGLRenderingFolded {
  viewport: WebGLViewport;

  // the source graph on the embedding will be processed before being set to here.
  // these two graphs are not isomorphic (source and this one for rendering).
  // (faces will be triangulated and exploded and cuts will be processed)
  graph: FOLD = $state({});

  // this graph for rendering and the source graph are not isomorphic,
  // this maps this graph's vertices (index) to the vertex index from
  // the source graph (value).
  // #mapping: { vertices: number[], edges: number[], faces: number[] } = $state({ vertices: [], edges: [], faces: [] });
  #mapping: { vertices: number[], edges: number[], faces: number[] } | undefined = $state();

  // style data
  assignmentsColor: { [key: string]: number[] } = $derived.by(() => ({
    ...(this.viewport.style.darkMode ? dark : light),
    // ...options,
  }));

  // metadata
  file_classes = $derived(this.graph?.file_classes ?? []);
  frame_classes = $derived(this.graph?.frame_classes ?? []);
  className = $derived(this.file_classes.concat(this.frame_classes).join(" "));

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
  vertices_coords3: [number, number, number][] = $derived((this.graph?.vertices_coords ?? [])
    .map(coord => [coord[0] ?? 0, coord[1] ?? 0, coord[2] ?? 0]));

  // edges
  edgesCoords2: [[number, number], [number, number]][] = $derived((this.graph?.edges_vertices ?? [])
    .map((ev) => [
      this.vertices_coords2[ev[0]] ?? [0, 0],
      this.vertices_coords2[ev[1]] ?? [0, 0],
    ]));
  edgesCoords3: [[number, number, number], [number, number, number]][] = $derived((this.graph?.edges_vertices ?? [])
    .map((ev) => [
      this.vertices_coords3[ev[0]] ?? [0, 0, 0],
      this.vertices_coords3[ev[1]] ?? [0, 0, 0],
    ]));

  // faces
  facesCoords2: [number, number][][] = $derived((this.graph?.faces_vertices ?? [])
    .map((fv) => (fv ?? []).map(v => this.vertices_coords2[v] ?? [0, 0])));
  facesCoords3: [number, number, number][][] = $derived((this.graph?.faces_vertices ?? [])
    .map((fv) => (fv ?? []).map(v => this.vertices_coords3[v] ?? [0, 0, 0])));

  facesNormal3: [number, number, number][] = $derived((this.graph?.faces_vertices ?? [])
    .map((_, i) => this.facesCoords3[i])
    .map(polygon => {
      try {
        // we have to ensure that the two edges we choose are not parallel
        let a;
        let b;
        let i = 0;
        do {
          a = subtract3(polygon[(i + 1) % polygon.length], polygon[i]);
          b = subtract3(polygon[(i + 2) % polygon.length], polygon[i]);
          i += 1;
        } while (i < polygon.length && parallel(a, b));
        return normalize3(cross3(a, b));
      } catch { return [0, 0, 0]; }
    }));

  verticesNormal3 = $derived(makeVerticesNormal({
    vertices_coords: this.vertices_coords3,
    faces_vertices: this.graph.faces_vertices,
    faces_normal: this.facesNormal3,
  }));

  facesEdgesIsJoined: boolean[][] = $derived((this.graph.faces_edges ?? [])
    .map((edges) => edges
      .map((e) => this.graph.edges_assignment?.[e])
      .map((a) => a === "J" || a === "j")));

  verticesBarycentric: [number, number, number][] = $derived.by(() => {
    const vertices_barycentric: [number, number, number][] = (this.vertices_coords3 ?? [])
      .map((_, i) => i % 3)
      .map((n) => [n === 0 ? 1 : 0, n === 1 ? 1 : 0, n === 2 ? 1 : 0]);
    this.facesEdgesIsJoined.forEach((edgesJoined, i) => edgesJoined.forEach((joined, j) => {
      if (!joined) { return; }
      const next = (j + 1) % edgesJoined.length;
      const prev = (j + edgesJoined.length - 1) % edgesJoined.length;
      vertices_barycentric[i * 3 + j][prev] = vertices_barycentric[i * 3 + next][prev] = 100;
    }));
    return vertices_barycentric;
  });

  facesSide: boolean[] = $derived((this.graph?.faces_vertices ?? [])
    .map(() => true));

  // renderable components
  vertexArrayVertices2: Float32Array = $derived(new Float32Array(this.vertices_coords2.flat()));
  vertexArrayVertices3: Float32Array = $derived(new Float32Array(this.vertices_coords3.flat()));
  vertexArrayVerticesNormal3: Float32Array = $derived(new Float32Array(this.verticesNormal3.flat()));
  vertexArrayVerticesBarycentric3: Float32Array = $derived(new Float32Array(this.verticesBarycentric.flat()));

  elementArrayFaces: Uint16Array | Uint32Array = $derived.by(() => this.viewport.version === 2
    ? new Uint32Array(this.graph.faces_vertices?.flat() ?? [])
    : new Uint16Array(this.graph.faces_vertices?.flat() ?? []));

  #effects: (() => void)[] = [];

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.#effects = [
      this.#effectGraph(),
      this.#effectSetSelection(),
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
          this.viewport.embedding?.embeddingUpdate?.reset,
          this.viewport.embedding?.embeddingUpdate?.structural,
          this.viewport.embedding?.embeddingUpdate?.isomorphic.coords,
          // todo: move face orders to another effect
          this.viewport.embedding?.embeddingUpdate?.isomorphic.faceOrders,
        ];
        console.log("SVGRendering(): update graph");
        try {
          const inputGraph = { ...this.viewport.embedding?.graph };
          // explode the graph (vertices unique to one face) for a few reasons like
          // flat shading (stylistic) and barycentric values (face-boundary shading)
          const { vertices_map, graph } = prepareForRendering(inputGraph, earcut);
          if (graph.edges_assignment && !graph.edges_foldAngle) {
            graph.edges_foldAngle = makeEdgesFoldAngle(graph);
          }
          if (graph.vertices_coords && graph.faces_vertices) {
            graph.vertices_faces = makeVerticesFacesSimple(graph);
          }
          if (graph.edges_vertices && graph.faces_vertices) {
            graph.faces_edges = makeFacesEdgesFromVertices(graph);
          }
          // todo: check if graph has all required fields, otherwise, set to {}
          console.log("effect graph", graph);
          this.graph = graph;
        } catch {
          this.graph = {};
        }
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


