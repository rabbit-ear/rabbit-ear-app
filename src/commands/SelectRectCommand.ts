import type { Command } from "./Command.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";
import type { Box } from "rabbit-ear/types.js";
import type { FOLDSelection } from "../general/types.ts";
import { getComponentsInsideRect } from "../general/overlap.ts";

export class SelectRectCommand implements Command {
  constructor(private document: FileDocument, private box: Box) { }

  private previousSelection: FOLDSelection | undefined;

  // todo: this is hard coded to read from the crease pattern
  // need to somehow paramterize which model we are looking at
  execute(): void {
    this.previousSelection = this.document.model.cp.selection;
    this.document.updateModel((model) => {
      model.cp.selection = getComponentsInsideRect(model.cp.graph ?? {}, this.box);
    });
  }

  undo(): void {
    this.document.updateModel((model) => {
      model.cp.selection = this.previousSelection;
    });
  }
}

