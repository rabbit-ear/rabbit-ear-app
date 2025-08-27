import type { Command } from "./Command.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";
import { add2, add3, resize3 } from "rabbit-ear/math/vector.js";

export class SelectRectCommand implements Command {
  constructor(
    private document: FileDocument,
    private embeddingName: string,
    private translation: [number, number] | [number, number, number]) { }

  private previousVerticesCoords: [number, number][] | [number, number, number][] | undefined;

  // todo: this is hard coded to read from the crease pattern
  // need to somehow paramterize which model we are looking at
  execute(): void {
    // this.previousVerticesCoords = this.document.data?.getEmbedding(this.embeddingName)?.graph?.vertices_coords;
    this.previousVerticesCoords = this.document.data?.frame.vertices_coords;
    this.document.updateFrame((frame) => {
      // const embedding = data.getEmbedding(this.embeddingName);
      // if (!embedding) { return; }
      const translation3 = resize3(this.translation);
      if (!frame.vertices_coords) { return undefined; }
      const dimension = data?.frameAttributes.dimension ?? frame.vertices_coords[0]?.length;
      switch (dimension) {
        case 2:
          frame.vertices_coords = frame.vertices_coords
            .map(coords => add2(coords, this.translation));
          break;
        case 3:
          frame.vertices_coords = frame.vertices_coords
            .map(coords => add3(coords as [number, number, number], translation3));
          break;
      }
      return { isomorphic: { coords: true } };
    });
  }

  undo(): void {
    this.document.updateFrame((frame) => {
      // const embedding = data.getEmbedding(this.embeddingName);
      // if (!embedding) { return; }
      frame.vertices_coords = this.previousVerticesCoords;
      return { isomorphic: { coords: true } };
    });
  }

  tryMerge(other: Command): boolean {
    return false;
  }
}

