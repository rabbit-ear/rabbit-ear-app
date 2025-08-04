import { writeTextFile, readTextFile } from "../system/fs.ts";
import type { Command } from "../commands/Command";
import { FileModel } from "./FileModel.svelte.ts";
import { getFileName } from "../system/path.ts";

export class FileDocument {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  private filePath: string | undefined = $state();
  private dataModel: FileModel;
  private isDirty: boolean;

  private fileName?: string = $derived(getFileName(this.filePath || ""));

  get canUndo(): boolean { return this.undoStack.length > 0; }
  get canRedo(): boolean { return this.redoStack.length > 0; }
  get path() { return this.filePath; }
  get dirty() { return this.isDirty; }
  get name() { return this.fileName; }

  // this returns a Readonly copy to prevent developers from modifying
  // the contents of the data model directly.
  // all modifications should use this.updateModel so the dirty flag is set.
  getModel(): Readonly<FileModel> { return this.dataModel; }

  constructor(path: string | undefined, initialData: FileModel) {
    this.filePath = path;
    this.dataModel = initialData;
    this.isDirty = false;
  }

  executeCommand(command: Command): void {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = [];
    this.isDirty = true;
  }

  undo(): void {
    const command = this.undoStack.pop();
    if (!command) { return; }
    command.undo();
    this.redoStack.push(command);
    this.isDirty = true;
  }

  redo(): void {
    const command = this.redoStack.pop();
    if (!command) { return; }
    command.execute();
    this.undoStack.push(command);
    this.isDirty = true;
  }

  // This will return false if the save was not possible due to
  // the filePath not existing. Typically this means the UI should
  // trigger a "Save As..." dialog as the file has not yet been saved.
  async save(): Promise<boolean> {
    // intended usage: the UI triggers a Save As... dialog
    if (!this.filePath) {
      return false
    }
    // a couple checks to REALLY make sure that the file already exists
    // if (file does not exist) {
    //   this.saveFileAs();
    //   return;
    // }
    // fs.access(fileInfo.fullpath, fs.constants.F_OK)
    // fs.checkFileExistsAndWritable();
    await writeTextFile(this.filePath, this.dataModel.text);
    // todo: catch errors, if errors, do not run the next line.
    this.isDirty = false;
    return true;
  }

  async saveAs(newPath: string): Promise<void> {
    this.filePath = newPath;
    await this.save();
  }

  async reload(): Promise<void> {
    if (!this.filePath) { return; }
    const contents = await readTextFile(this.filePath);
    this.dataModel.text = contents;
    this.isDirty = false;
  }

  updateModel(mutator: (model: FileModel) => void) {
    mutator(this.dataModel);
    this.isDirty = true;
  }
}
