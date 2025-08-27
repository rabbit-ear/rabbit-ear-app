import type { FOLD, FOLDChildFrame } from "rabbit-ear/types.d.ts";
import type { Command } from "../commands/Command";
import type { GraphUpdateModifier } from "../graphs/Updated.ts";
import { writeTextFile, readTextFile } from "../system/fs.ts";
import { getFileName } from "../system/path.ts";
import { GraphData } from "../graphs/GraphData.svelte.ts";
import { HistoryManager } from "./HistoryManager.svelte.ts";

export class FileDocument {
  #history: HistoryManager;
  #filePath: string | undefined = $state();
  #isDirty: boolean = $state(false);
  #data: GraphData;

  #fileName?: string = $derived(getFileName(this.#filePath || ""));

  get canUndo(): boolean { return this.#history.undoStack.length > 0; }
  get canRedo(): boolean { return this.#history.redoStack.length > 0; }
  get path() { return this.#filePath; }
  get dirty() { return this.#isDirty; }
  get name() { return this.#fileName; }

  // this returns a Readonly copy to prevent developers from modifying
  // the contents of the data directly.
  // all modifications should use this.update so the dirty flag is set.
  get data(): Readonly<GraphData> { return this.#data; }

  get undoStack(): Readonly<Command[]> { return this.#history.undoStack; }
  get redoStack(): Readonly<Command[]> { return this.#history.redoStack; }

  constructor(path: string | undefined, initialData: FOLD) {
    this.#filePath = path;
    this.#data = new GraphData(initialData);
    this.#history = new HistoryManager();
    this.#isDirty = false;
  }

  dealloc(): void {
    this.#data?.dealloc();
  }

  executeCommand(command: Command): void {
    this.#history.executeCommand(command);
  }

  undo(): void {
    const result = this.#history.undo();
    this.#isDirty ||= result;
  }

  redo(): void {
    const result = this.#history.redo();
    this.#isDirty ||= result;
  }

  // This will return false if the save was not possible due to
  // the filePath not existing. Typically this means the UI should
  // trigger a "Save As..." dialog as the file has not yet been saved.
  async save(): Promise<boolean> {
    // intended usage: the UI triggers a Save As... dialog
    if (!this.#filePath) {
      return false
    }

    // a couple checks to REALLY make sure that the file already exists
    // if (file does not exist) {
    //   this.saveFileAs();
    //   return;
    // }
    // fs.access(fileInfo.fullpath, fs.constants.F_OK)
    // fs.checkFileExistsAndWritable();

    await writeTextFile(this.#filePath, this.#data.exportToText());
    // todo: catch errors, if errors, do not run the next line.
    this.#isDirty = false;
    return true;
  }

  async saveAs(newPath: string): Promise<void> {
    this.#filePath = newPath;
    await this.save();
  }

  async reload(): Promise<boolean> {
    if (!this.#filePath) { return false; }
    try {
      const contents = await readTextFile(this.#filePath);
      const data = JSON.parse(contents);
      this.#data.import(data);
      this.#history.clear();
      this.#isDirty = false;
      return true;
    } catch {
      return false;
    }
  }

  updateFrame(mutator: (frame: FOLDChildFrame) => (GraphUpdateModifier | undefined), dirty?: boolean) {
    if (dirty !== false) { this.#isDirty = true; }
    return this.#data.mutateFrame(mutator);
  }

  updateSource(mutator: (data: GraphData) => (GraphUpdateModifier | undefined), dirty?: boolean) {
    if (dirty !== false) { this.#isDirty = true; }
    return this.#data.mutateSource(mutator);
  }
}
