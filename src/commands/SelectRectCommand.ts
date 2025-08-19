import type { Command } from "./Command.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";
import type { Box } from "rabbit-ear/types.js";
import type { FOLDSelection } from "../general/types.ts";
import { getComponentsInsideRect } from "../general/overlap.ts";

export class SelectRectCommand implements Command {
  // todo: consider a static initializer which can return null
  // if conditions are not met (box has zero volume)
  constructor(private document: FileDocument, private embeddingName: string, private box: Box) { }

  private previousSelection: FOLDSelection | undefined;

  execute(): void {
    this.previousSelection = this.document.data?.getEmbedding(this.embeddingName)?.selection;
    this.document.update((data) => {
      const embedding = data.getEmbedding(this.embeddingName);
      if (!embedding) { return; }
      embedding.selection = getComponentsInsideRect(embedding.graph ?? {}, this.box);
    });
  }

  undo(): void {
    this.document.update((data) => {
      const embedding = data.getEmbedding(this.embeddingName);
      if (!embedding) { return; }
      embedding.selection = this.previousSelection;
    });
  }
}

