import type { FOLD } from "rabbit-ear/types.js";
import type { Command } from "./Command.ts";
import type { GraphUpdateModifier } from "../graphs/Updated.ts";
import type { FOLDSelection } from "../general/selection.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";
import { explodeAlongSeam } from "../general/seam.ts";
import { scaleVerticesCoords } from "../general/affine.ts";

export class AffineScaleCommand implements Command {
  // please construct an array with holes for newCoords with
  // the indices requiring changes with their corresponding values
  constructor(
    private doc: FileDocument,
    private scaleAmount: number,
    private origin: [number, number] | [number, number, number],
    private selection: FOLDSelection | undefined,
    private shouldDetach: boolean = false,
  ) { }

  previousVerticesCoords: [number, number][] | [number, number, number][] | undefined;
  previousGraph: FOLD | undefined;

  execute(): void {
    this.doc.updateGraph((frame): GraphUpdateModifier | undefined => {
      if (!frame.vertices_coords) { return undefined; }
      if (this.shouldDetach) {
        this.previousGraph = { ...frame };
      } else {
        this.previousVerticesCoords = frame.vertices_coords;
      }
      const newSelection = this.shouldDetach && this.selection
        ? explodeAlongSeam(frame, this.selection)
        : this.selection;
      console.log("new selection", newSelection);
      frame.vertices_coords = scaleVerticesCoords(
        this.scaleAmount,
        this.origin,
        frame.vertices_coords,
        newSelection);
      return this.shouldDetach
        ? { structural: true }
        : { isomorphic: { coords: true } };
    });
  }

  undo(): void {
    this.doc.updateGraph((frame): GraphUpdateModifier | undefined => {
      if (!frame.vertices_coords) { return undefined; }
      if (this.shouldDetach && this.previousGraph) {
        Object.keys(this.previousGraph).forEach(key => {
          frame[key] = this.previousGraph[key];
        });
        return { structural: true };
      } else {
        frame.vertices_coords = this.previousVerticesCoords;
        return { isomorphic: { coords: true } };
      }
    });
  }

  tryMerge(other: Command): boolean {
    return false;
  }
}

