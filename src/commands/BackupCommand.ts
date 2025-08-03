import type { Command } from "./Command.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";
import { FileModel } from "../app/FileModel.svelte.ts";

export class BackupCommand implements Command {
  constructor(private model: FileModel, private position: number, private text: string) {

  }

  private previousModel: FileModel = new FileModel();

  execute(): void {
    this.previousModel = this.model;
    const newText =
      this.model.text.slice(0, this.position) +
      this.text +
      this.model.text.slice(this.position);
    this.model.setFromText(newText);
  }

  undo(): void {
    this.model = this.previousModel;
  }
}

