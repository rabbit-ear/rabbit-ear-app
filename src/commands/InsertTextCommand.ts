import type { Command } from "./Command.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";

export class InsertTextCommand implements Command {
  constructor(private document: FileDocument, private position: number, private text: string) { }

  private previousText: string = "";

  execute(): void {
    this.previousText = this.document.data?.text;
    this.document.update((data) => {
      data.text =
        data.text.slice(0, this.position) +
        this.text +
        data.text.slice(this.position);
    });
  }

  undo(): void {
    this.document.update((data) => {
      data.text = this.previousText;
    });
  }
}

