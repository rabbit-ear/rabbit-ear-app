import type { Command } from "./Command.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";

export class InsertTextCommand implements Command {
  constructor(private document: FileDocument, private position: number, private text: string) { }

  private previousText: string = "";

  execute(): void {
    this.previousText = this.document.data?.text;
    this.document.updateFrame((frame) => {
      frame.text =
        frame.text.slice(0, this.position) +
        this.text +
        frame.text.slice(this.position);
    });
  }

  undo(): void {
    this.document.updateFrame((frame) => {
      frame.text = this.previousText;
    });
  }

  tryMerge(other: Command): boolean {
    return false;
  }
}

