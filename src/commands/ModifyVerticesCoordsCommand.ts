import type { Command } from "./Command.ts";
import type { GraphUpdateModifier } from "../graphs/Updated.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";

export class ModifyVerticesCoordsCommand implements Command {
  // please construct an array with holes for newCoords with
  // the indices requiring changes with their corresponding values
  constructor(
    private doc: FileDocument,
    private newCoords: [number, number][]) {
    console.log("Modify vertices constructor", this.doc, this.newCoords);
  }

  previousCoords: [number, number][] | undefined;

  execute(): void {
    this.doc.updateFrame((frame): GraphUpdateModifier | undefined => {
      if (!frame.vertices_coords) { return undefined; }
      this.previousCoords = [];
      this.newCoords.forEach((coords, index) => {
        // need to resize the input into 2 or 3 dimensions
        this.previousCoords[index] = [...frame.vertices_coords![index]];
      });
      this.newCoords.forEach((coords, index) => {
        frame.vertices_coords![index] = coords;
      });
      return { isomorphic: { coords: true } };
    });
  }

  undo(): void {
    this.doc.updateFrame((frame): GraphUpdateModifier | undefined => {
      if (!frame.vertices_coords) { return undefined; }
      this.previousCoords?.forEach((coords, index) => {
        frame.vertices_coords![index] = coords;
      })
      return { isomorphic: { coords: true } };
    });
  }

  tryMerge(other: Command): boolean {
    return false;
  }
}

