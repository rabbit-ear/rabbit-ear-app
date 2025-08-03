import type { Command } from "./Command.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";

export class InsertTextCommand implements Command {
  constructor(private document: FileDocument, private position: number, private text: string) { }

  private previousText: string = "";

  execute(): void {
    this.previousText = this.document.getModel().text;
    this.document.updateModel((model) => {
      model.text =
        model.text.slice(0, this.position) +
        this.text +
        model.text.slice(this.position);
    });
  }

  undo(): void {
    this.document.updateModel((model) => {
      model.text = this.previousText;
    });
  }
}

