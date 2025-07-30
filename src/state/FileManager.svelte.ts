import { readTextFile } from "@tauri-apps/plugin-fs";
import { FileDocument } from "./FileDocument.svelte";
import { FileModel } from "./FileModel.svelte";

export class FileManager {
  // private documents: FileDocument[] = $state([]);
  documents: FileDocument[] = $state([]);
  activeIndex: number = $state(0);
  activeDocument: FileDocument | undefined = $state(this.documents[this.activeIndex]);

  // allDocuments: FileDocument[] = $state([...this.documents]);

  // get activeDocument(): FileDocument | undefined {
  //   return this.documents[this.activeIndex];
  // }

  // get allDocuments(): FileDocument[] {
  //   return [...this.documents];
  // }

  switchTo(index: number): void {
    this.activeIndex = Math.max(0, Math.min(index, this.documents.length - 1));
  }

  async openFile(filePath: string): Promise<void> {
    // check if already open
    const existingIndex = this.documents.findIndex(doc => doc.path === filePath);
    if (existingIndex !== -1) {
      this.activeIndex = existingIndex;
      return;
    }
    // load
    const data = await readTextFile(filePath);
    const document = new FileDocument(filePath, new FileModel(data));
    this.documents.push(document);
    this.activeIndex = this.documents.length - 1;
  }

  async openFiles(filePaths: string[]): Promise<void> {
    // check if any of them are already open
    const unopenedFilePaths = filePaths
      .filter(path => this.documents.findIndex(doc => doc.path === path) === -1);
    if (!unopenedFilePaths.length) { return; }
    await Promise.all(unopenedFilePaths.map(async filePath => {
      const data = await readTextFile(filePath);
      const document = new FileDocument(filePath, new FileModel(data));
      this.documents.push(document);
    }));
    this.activeIndex = this.documents.length - 1;
  }

  // async newFile(initialContents = ""): Promise<void> {
  async newFile(): Promise<void> {
    const document = new FileDocument(undefined, new FileModel());
    this.documents.push(document);
    this.activeIndex = this.documents.length - 1;
  }

  closeFile(index: number): void {
    const document = this.documents[index];
    if (!document) { return; }
    this.documents.splice(index, 1);
    this.activeIndex = Math.max(this.activeIndex, this.documents.length - 1);
  }

  closeDocument(document: FileDocument): void {
    return this.closeFile(this.documents.indexOf(document));
  }

  closeAll(): void {
    this.documents = [];
    this.activeIndex = 0;
  }

  getAllUnsavedDocuments(): FileDocument[] {
    return this.documents.filter(document => document.dirty);
  }
}
