export class FileModel {
  private dataText: string;

  constructor(contents?: string) {
    this.dataText = contents || "";
  }

  get text(): string { return this.dataText; }
  set text(newText: string) { this.dataText = newText; }
}
