import type { Command } from "./Command.ts";
import type { GraphUpdateModifier } from "../graphs/Updated.ts";
import type { FOLDSelection } from "../general/selection.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";
import {
  add2,
  scale2,
  subtract2,
  resize2,
  add3,
  scale3,
  subtract3,
  resize3,
} from "rabbit-ear/math/vector.js";
import { getDimensionQuick } from "rabbit-ear/fold/spec.js";

export class AffineScaleCommand implements Command {
  // please construct an array with holes for newCoords with
  // the indices requiring changes with their corresponding values
  constructor(
    private doc: FileDocument,
    private scaleAmount: number,
    private origin: [number, number] | [number, number, number],
    private selection: FOLDSelection | undefined) { }

  previousVerticesCoords: [number, number][] | [number, number, number][] | undefined;

  #scaleVerticesCoords2(
    scaleAmount: number,
    origin: [number, number],
    vertices_coords: [number, number][],
  ): [number, number][] {
    if (this.selection && this.selection.vertices) {
      return vertices_coords.map((coord, i) => this.selection!.vertices!.has(i)
        ? add2(scale2(subtract2(coord, origin), scaleAmount), origin)
        : coord);
    }
    return vertices_coords.map((coord) =>
      add2(scale2(subtract2(coord, origin), scaleAmount), origin),
    );
  }

  #scaleVerticesCoords3(
    scaleAmount: number,
    origin: [number, number, number],
    vertices_coords: [number, number, number][],
  ): [number, number, number][] {
    if (this.selection && this.selection.vertices) {
      return vertices_coords.map((coord, i) => this.selection!.vertices!.has(i)
        ? add3(scale3(subtract3(coord, origin), scaleAmount), origin)
        : coord);
    }
    return vertices_coords.map((coord) =>
      add3(scale3(subtract3(coord, origin), scaleAmount), origin),
    );
  }

  #scaleVerticesCoords(
    scaleAmount: number,
    origin: [number, number] | [number, number, number],
    vertices_coords: [number, number][] | [number, number, number][],
  ): [number, number][] | [number, number, number][] {
    switch (getDimensionQuick({ vertices_coords })) {
      case 2: return this.#scaleVerticesCoords2(
        scaleAmount,
        resize2(origin),
        vertices_coords as [number, number][]);
      default: return this.#scaleVerticesCoords3(
        scaleAmount,
        resize3(origin),
        vertices_coords as [number, number, number][]);
    }
  }

  execute(): void {
    this.doc.updateFrame((frame): GraphUpdateModifier | undefined => {
      if (!frame.vertices_coords) { return undefined; }
      this.previousVerticesCoords = frame.vertices_coords;
      frame.vertices_coords = this.#scaleVerticesCoords(
        this.scaleAmount,
        this.origin,
        frame.vertices_coords);
      return { isomorphic: { coords: true } };
    });
  }

  undo(): void {
    this.doc.updateFrame((frame): GraphUpdateModifier | undefined => {
      if (!frame.vertices_coords) { return undefined; }
      frame.vertices_coords = this.previousVerticesCoords;
      return { isomorphic: { coords: true } };
    });
  }

  tryMerge(other: Command): boolean {
    return false;
  }
}

