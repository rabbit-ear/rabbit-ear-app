import { save, open } from "@tauri-apps/plugin-dialog";
import { confirm } from "@tauri-apps/plugin-dialog";
import { homeDir } from '@tauri-apps/api/path';
import { FileManager } from "./FileManager.svelte.ts";
import { FileDocument } from "./FileDocument.svelte.ts";
import { EXTENSION, EXTENSIONS, FILE_TYPE_NAME, UNTITLED_FILENAME } from "../system/constants.ts";

const defaultFileDialogFilter = () => ({
  name: FILE_TYPE_NAME,
  extensions: [EXTENSION],
});

export class FileController {
  constructor(private fileManager: FileManager) {
    this.fileManager = fileManager;
  }

  async openFilesWithDialog(): Promise<void> {
    const filters = [defaultFileDialogFilter()];
    const result = await open({ multiple: true, filters });
    if (Array.isArray(result)) {
      await this.fileManager.openFiles(result);
    } else if (result !== null && typeof result === "string") {
      await this.fileManager.openFile(result);
    } else {
      return;
    }
  }

  async saveDocumentWithSaveAsDialog(document: FileDocument): Promise<boolean> {
    const filters = [defaultFileDialogFilter()];
    const defaultPath = document.path ?? await homeDir();
    const path = await save({ defaultPath, filters });
    if (!path) { return false; }
    document.saveAs(path);
    return true;
  }

  // save a FileDocument. If the document does not have a path
  // (has not yet been saved), then open a "Save As..." dialog.
  async saveDocument(document: FileDocument): Promise<boolean> {
    return document.path
      ? await document.save()
      : await this.saveDocumentWithSaveAsDialog(document);
  }

  async saveActiveDocumentWithSaveAsDialog(): Promise<boolean> {
    const document = this.fileManager.activeDocument;
    // todo: there are 3 types of results not 2, but two of them
    // are both failures: user cancelled, and this- error with document
    if (!document) { return false; }
    return this.saveDocumentWithSaveAsDialog(document);
  }

  // save the currently opened document. If the document does not have a path
  // (has not yet been saved), then open a "Save As..." dialog.
  async saveActiveDocument(): Promise<boolean> {
    const document = this.fileManager.activeDocument;
    // todo: there are 3 types of results not 2, but two of them
    // are both failures: user cancelled, and this- error with document
    if (!document) { return false; }
    return this.saveDocument(document);
  }

  async newFile() {
    await this.fileManager.newFile();
  }

  async requestCloseDocument(document: FileDocument): Promise<boolean> {
    if (!document.dirty) {
      this.fileManager.closeDocument(document);
      return true;
    }

    switch (await confirm("Save before closing?", {
      title: "File \"${document.name}\" has unsaved changes.",
      kind: "warning",
      // kind: "question",
      // buttons: [yesString, cancelString, noString],
    })) {
      // "Yes": save file/open save dialog then close the document
      case true:
        if (await document.save()) {
          this.fileManager.closeDocument(document);
        } else {
          // the save was unsuccessful because the file has not yet
          // been saved (it has no filePath). Open a SaveAs dialog
          const filters = [defaultFileDialogFilter()];
          const defaultPath = await homeDir();
          const options = !defaultPath || defaultPath === ""
            ? { filters }
            : { filters, defaultPath };
          const filePath = await save(options);
          if (filePath) {
            document.saveAs(filePath);
            this.fileManager.closeDocument(document);
          } else {
            // user canceled the save dialog.
            // do not close the document, treat this now as a "Cancel"
          }
        }
        break;

      // "No": do not save file and close the document
      // case No:
      //   this.fileManager.closeDocument(document);
      //   break;

      // "Cancel": do not do anything and exit this function
      case false: return false;
    }
    return false;
  }

  async requestCloseDocumentAtIndex(index: number) {
    const document = this.fileManager.documents[index];
    if (!document) { return; }
    return this.requestCloseDocument(document);
  }

  async requestCloseActiveDocument() {
    const document = this.fileManager.activeDocument;
    if (!document) { return; }
    return this.requestCloseDocument(document);
  }

  async requestCloseAll(): Promise<boolean> {
    const unsavedDocuments = this.fileManager.getAllUnsavedDocuments();
    if (unsavedDocuments.length === 0) {
      this.fileManager.closeAll();
      return true;
    }

    switch (await confirm("Save before closing?", {
      title: "You have \"${unsavedDocuments.length}\" unsaved files.",
      kind: "warning",
      // kind: "question",
      // buttons: [yesString, cancelString, noString],
    })) {
      // "Yes": 
      case true:
        // todo: need to trigger the view to show the file
        // which is attempting to be saved at each step
        for (const document of unsavedDocuments) {
          const success = await this.saveDocument(document);
          // if the user cancels a file save, consider it to be
          // intended to cancel the rest of the file saves too.
          if (!success) { return false; }
        }
        this.fileManager.closeAll();
        return true;

      case false:
        this.fileManager.closeAll();
        return true;

      // case "Cancel":
      //   return false;
    }
  }
}
