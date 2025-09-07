import type { Command } from "./Command.ts";
import type { Box } from "rabbit-ear/types.js";
import type { FOLDSelection } from "../general/selection.ts";
import type { GraphUpdateModifier } from "../graphs/Updated.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";
import { getComponentsInsideRect } from "../general/selection.ts";
import { strictSelectComponents } from "../general/subcomplex.ts";

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
    private components: VEFBoolean) { }

  private previousSelection: FOLDSelection | undefined;

  execute(): void {
    this.previousSelection = this.document.data?.selection;
    this.document.updateSource((data): GraphUpdateModifier | undefined => {
      const embedding = data?.getEmbedding(this.embeddingName);
      if (!embedding) { return undefined; }
      // const selection = getComponentsInsideRect(embedding.graph ?? {}, this.box);
      const selection = strictSelectComponents(embedding.graph ?? {}, this.box);
      data.selection = filterSelection(selection, this.components);
      return undefined
    }, false);
  }

  undo(): void {
    this.document.updateSource((data): GraphUpdateModifier | undefined => {
      if (!data) { return undefined; }
      data.selection = this.previousSelection;
      return undefined;
    }, false);
  }

  tryMerge(other: Command): boolean {
    return false;
  }
}

