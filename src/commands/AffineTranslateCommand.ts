import type { FOLD } from "rabbit-ear/types.js";
import type { Command } from "./Command.ts";
import type { GraphUpdateModifier } from "../graphs/Updated.ts";
import type { FOLDSelection } from "../general/selection.ts";
import type { GraphData } from "../graphs/GraphData.svelte.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";
import { explodeAlongSeam } from "../general/seam.ts";
import { translateVerticesCoords } from "../general/affine.ts";
import { validate } from "rabbit-ear/graph/validate/validate.js";

export class AffineTranslateCommand implements Command {
  // please construct an array with holes for newCoords with
  // the indices requiring changes with their corresponding values
  constructor(
    private doc: FileDocument,
    private translate: [number, number] | [number, number, number],
    private selection: FOLDSelection | undefined,
    private shouldDetach: boolean = false,
  ) { }

  previousVerticesCoords: [number, number][] | [number, number, number][] | undefined;
  previousGraph: FOLD | undefined;

  execute(): void {
    // this.doc.updateGraph((graph): GraphUpdateModifier | undefined => {
    this.doc.updateData((data: GraphData): GraphUpdateModifier | undefined => {
      const graph = data.frame.graph;
      if (!graph.vertices_coords) { return undefined; }
      if (this.shouldDetach) {
        this.previousGraph = { ...graph };
      } else {
        this.previousVerticesCoords = graph.vertices_coords;
      }
      // todo: this is building a bad graph. it is triggering an issue with
      // facesWinding() method in rabbit ear.
      // const newSelection = this.selection;
      const newSelection = this.shouldDetach && this.selection
        ? explodeAlongSeam(graph, this.selection)
        : this.selection;
      console.log("execite() isvalid", validate(graph), graph);
      data.frame.selection = undefined;
      graph.vertices_coords = translateVerticesCoords(
        this.translate,
        graph.vertices_coords,
        newSelection);
      return this.shouldDetach
        ? { structural: true, selection: true }
        : { isomorphic: { coords: true }, selection: true };
    });
  }

  undo(): void {
    this.doc.updateGraph((graph): GraphUpdateModifier | undefined => {
      if (!graph.vertices_coords) { return undefined; }
      if (this.shouldDetach && this.previousGraph) {
        Object.keys(this.previousGraph).forEach(key => {
          graph[key] = this.previousGraph[key];
        });
        return { structural: true };
      } else {
        graph.vertices_coords = this.previousVerticesCoords;
        return { isomorphic: { coords: true } };
      }
    });
  }

  tryMerge(other: Command): boolean {
    return false;
  }
}

