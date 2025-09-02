import type { Command } from "./Command.ts";
import type { Box } from "rabbit-ear/types.js";
import type { FOLDSelection } from "../general/selection.ts";
import type { GraphUpdateModifier } from "../graphs/Updated.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";
import { getComponentsInsideRect } from "../general/selection.ts";

export class SelectRectCommand implements Command {
  constructor(private document: FileDocument, private embeddingName: string, private box: Box) { }

  private previousSelection: FOLDSelection | undefined;

  execute(): void {
    this.previousSelection = this.document.data?.selection;
    this.document.updateSource((data): GraphUpdateModifier | undefined => {
      const embedding = data?.getEmbedding(this.embeddingName);
      if (!embedding) { return undefined; }
      data.selection = getComponentsInsideRect(embedding.graph ?? {}, this.box);
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

