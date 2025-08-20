import type { Command } from "./Command.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";
import type { Box } from "rabbit-ear/types.js";
import type { FOLDSelection } from "../general/types.ts";
import { getComponentsInsideRect } from "../general/overlap.ts";

export class SelectRectCommand implements Command {
  constructor(private document: FileDocument, private embeddingName: string, private box: Box) { }

  private previousSelection: FOLDSelection | undefined;

  execute(): void {
    this.previousSelection = this.document.data?.getEmbedding(this.embeddingName)?.selection;
    this.document.updateClean((_, data) => {
      const embedding = data?.getEmbedding(this.embeddingName);
      if (!embedding) { return { modified: false }; }
      embedding.selection = getComponentsInsideRect(embedding.graph ?? {}, this.box);
      return { modified: false };
    });
  }

  undo(): void {
    this.document.updateClean((_, data) => {
      const embedding = data?.getEmbedding(this.embeddingName);
      if (!embedding) { return { modified: false }; }
      embedding.selection = this.previousSelection;
      return { modified: false };
    });
  }

  tryMerge(other: Command): boolean {
    return false;
  }
}

