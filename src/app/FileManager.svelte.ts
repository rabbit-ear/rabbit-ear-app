import { readTextFile } from "@tauri-apps/plugin-fs";
import { FileDocument } from "./FileDocument.svelte";
import { FileModel } from "./FileModel.svelte";

export class FileManager {
  #documents: FileDocument[] = $state([]);
  #activeIndex: number = $state(0);

  activeDocument: FileDocument | undefined = $derived(this.#documents[this.#activeIndex]);
  get documents(): readonly FileDocument[] { return this.#documents; }
  // get documents(): FileDocument[] { return [...this.documents]; }

  switchTo(index: number): void {
    this.#activeIndex = Math.max(0, Math.min(index, this.#documents.length - 1));
  }

  switchToDocument(document: FileDocument): void {
    const index = this.#documents.indexOf(document);
    if (index === -1) { return; }
    this.#activeIndex = index;
  }

  async openFile(filePath: string): Promise<Error | void> {
    // check if already open
    const existingIndex = this.#documents.findIndex(doc => doc.path === filePath);
    if (existingIndex !== -1) {
      this.#activeIndex = existingIndex;
      return;
    }
    // load
    try {
      const text = await readTextFile(filePath);
      const data = JSON.parse(text);
      const document = new FileDocument(filePath, new FileModel(data));
      this.#documents.push(document);
      this.#activeIndex = this.#documents.length - 1;
    } catch (err: unknown) {
      return err instanceof Error
        ? err
        : new Error(String(err));
    }
  }

  // throws
  async openFiles(filePaths: string[]): Promise<Error[]> {
    // check if any of them are already open
    const unopenedFilePaths = filePaths
      .filter(path => this.#documents.findIndex(doc => doc.path === path) === -1);
    if (!unopenedFilePaths.length) { return []; }
    const errors: Error[] = [];
    await Promise.all(unopenedFilePaths.map(async filePath => {
      try {
        const text = await readTextFile(filePath);
        const data = JSON.parse(text);
        const document = new FileDocument(filePath, new FileModel(data));
        this.#documents.push(document);
      } catch (err: unknown) {
        const error = err instanceof Error
          ? err
          : new Error(String(err));
        errors.push(error);
      }
    }));
    // same as openFile(), if a document is already opened, make it active
    const alreadyOpenedDocuments = filePaths
      .map(path => this.#documents.findIndex(doc => doc.path === path))
      .filter(index => index !== -1);
    this.#activeIndex = alreadyOpenedDocuments.length
      ? alreadyOpenedDocuments[0]
      : this.#documents.length - 1;
    return errors;
  }

  async newFile(): Promise<void> {
    // todo: should an empty FOLD file contain any metadata?
    const document = new FileDocument(undefined, new FileModel({}));
    this.#documents.push(document);
    this.#activeIndex = this.#documents.length - 1;
  }

  closeFile(index: number): void {
    const document = this.#documents[index];
    if (!document) { return; }
    this.#documents.splice(index, 1);
    this.#activeIndex = Math.min(this.#activeIndex, this.#documents.length - 1);
    console.log("FileManager file did close", this.#activeIndex);
  }

  closeDocument(document: FileDocument): void {
    return this.closeFile(this.#documents.indexOf(document));
  }

  closeAll(): void {
    this.#documents = [];
    this.#activeIndex = 0;
  }

  getAllUnsavedDocuments(): FileDocument[] {
    return this.#documents.filter(document => document.dirty);
  }
}
