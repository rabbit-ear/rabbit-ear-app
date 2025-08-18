import { readTextFile } from "@tauri-apps/plugin-fs";
import { FileDocument } from "./FileDocument.svelte";
import { UNTITLED_FILENAME } from "../system/constants.ts";

export class FileManager {
  #documents: FileDocument[] = $state([]);
  #activeIndex: number = $state(0);

  document: FileDocument | undefined = $derived(this.#documents[this.#activeIndex]);
  get documents(): readonly FileDocument[] { return this.#documents; }
  // get documents(): FileDocument[] { return [...this.documents]; }
  get activeIndex(): number { return this.#activeIndex; }

  get activeFileName(): string {
    return this.document?.path ?? UNTITLED_FILENAME;
  };

  switchTo(index: number): void {
    this.#activeIndex = Math.max(0, Math.min(index, this.#documents.length - 1));
  }

  switchToDocument(doc: FileDocument): void {
    const index = this.#documents.indexOf(doc);
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
      const doc = new FileDocument(filePath, data);
      this.#documents.push(doc);
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
        const doc = new FileDocument(filePath, data);
        this.#documents.push(doc);
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
    const doc = new FileDocument(undefined, {});
    this.#documents.push(doc);
    this.#activeIndex = this.#documents.length - 1;
  }

  closeFile(index: number): void {
    const doc = this.#documents[index];
    if (!doc) { return; }
    this.#documents.splice(index, 1);
    doc.dealloc();
    // if the current index is after the split index, move it up one
    this.#activeIndex = this.#activeIndex > index
      ? Math.max(0, Math.min(this.#activeIndex - 1, this.#documents.length - 1))
      : Math.min(this.#activeIndex, this.#documents.length - 1);
    console.log("FileManager file did close", this.#activeIndex);
  }

  closeDocument(doc: FileDocument): void {
    return this.closeFile(this.#documents.indexOf(doc));
  }

  closeAll(): void {
    this.#documents.forEach(doc => doc.dealloc());
    this.#documents = [];
    this.#activeIndex = 0;
  }

  getAllUnsavedDocuments(): FileDocument[] {
    return this.#documents.filter(doc => doc.dirty);
  }
}
