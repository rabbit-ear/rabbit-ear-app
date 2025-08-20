import type { Command } from "./Command.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";
import type { FOLD } from "rabbit-ear/types.js";

export class ModifyGraphCommand implements Command {
  constructor(
    private document: FileDocument,
    private formula: FOLD) { }

  #previousEntries: FOLD | undefined;

  execute(): void {
    this.document.update((frame) => {
      console.log("inside update function, what is this", this);
      if (!frame.vertices_coords) { return { modified: false }; }
      // this.#previousEntries = ;
      return { isomorphic: false };
    });
  }

  undo(): void {
    this.document.update((frame) => {
      if (!frame.vertices_coords) { return {}; }
      // frame.vertices_coords[this.vertexIndex] = this.previousCoords;
      return {};
    });
  }

  tryMerge(other: Command): boolean {
    return false;
  }
}


