import type { Command } from "./Command.ts";
import type { Box } from "rabbit-ear/types.js";
import type { FOLDSelection } from "../general/selection.ts";
import type { GraphUpdateModifier } from "../graphs/Updated.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";
import {
  getComponentsInRectInclusive,
  getComponentsInRectExclusive,
} from "../general/selection.ts";

type VEFBoolean = {
  vertices: boolean;
  edges: boolean;
  faces: boolean;
}

const filterSelection = (selection: FOLDSelection, pattern: VEFBoolean): FOLDSelection => {
  const result: FOLDSelection = {};
  if (pattern.vertices) { result.vertices = selection.vertices; }
  if (pattern.edges) { result.edges = selection.edges; }
  if (pattern.faces) { result.faces = selection.faces; }
  return result;
};

// if we expand this to include boxes: Box[], we need to match 1 box
// with 1 components boolean so that we can allow different ones for each step.
export class SelectRectCommand implements Command {
  constructor(
    private document: FileDocument,
    private embeddingName: string,
    private box: Box,
    private components: VEFBoolean,
    private strictSelect?: boolean) { }

  private previousSelection: FOLDSelection | undefined;

  execute(): void {
    this.previousSelection = this.document.data?.frame.selection;
    this.document.updateData((data): GraphUpdateModifier | undefined => {
      const embedding = data?.getEmbedding(this.embeddingName);
      if (!embedding) { return undefined; }
      const selection = this.strictSelect
        ? getComponentsInRectExclusive(embedding.graph ?? {}, this.box)
        : getComponentsInRectInclusive(embedding.graph ?? {}, this.box);
      data.frame.selection = filterSelection(selection, this.components);
      // return undefined;
      return { selection: true };
    }, false);
  }

  undo(): void {
    this.document.updateData((data): GraphUpdateModifier | undefined => {
      if (!data) { return undefined; }
      data.frame.selection = this.previousSelection;
      // return undefined;
      return { selection: true };
    }, false);
  }

  tryMerge(other: Command): boolean {
    return false;
  }
}

