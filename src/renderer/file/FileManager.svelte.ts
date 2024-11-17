import type { FOLD } from "rabbit-ear/types.js";
import type { FilePathInfo } from "../../main/fs/path.ts";
import { File } from "../file/File.svelte.ts";
import { EXTENSION, UNTITLED_FILENAME } from "../app/constants.svelte.ts";
import { file_spec, file_creator } from "rabbit-ear/fold/rabbitear.js";
import app from "../app/App.svelte.ts";
//import { showError } from "../app/Dialogs.svelte.ts";

const emptyFOLD = (): FOLD => ({ file_spec, file_creator });

// it should be possible to have multiple files opened by the same app,
// but that only one file is "currently open" (being shown on screen).
// in this way, we can flip between files, and for example, copy and paste data between.
//
// currently, this is hard coded to only ever have one file in spot [0]. "activeFile" never changes.
export class FileManager {
  files: File[] = $state([]);
  activeFile: number = $state(0);
  activeFrame: number = $state(0);

  get file(): File | undefined {
    return this.files[this.activeFile];
  }

  get frame(): FOLD | undefined {
    return this.file?.framesFlat[this.activeFrame];
  }

  // true: at least one opened file has unsaved changes.
  // false: all files have been saved, good to exit the app.
  hasUnsavedChanges(): boolean {
    return this.files.map((file) => file.modified).reduce((a, b) => a || b, false);
  }

  // // in the case where multiple simultaneous files are allowed open
  //loadFOLD(path: FilePathInfo, data: FOLD): void {
  //  const file = new File(path, data);
  //  this.files.push(file);
  //  this.activeFile = this.files.length - 1;
  //}

  loadFOLD(path: FilePathInfo, fold: FOLD): void {
    if (this.files[0]) {
      this.files[0].dealloc();
    }
    this.files[0] = new File(path, fold);
    this.activeFrame = 0;
  }

  // throws
  loadFOLDString(path: FilePathInfo, str: string): void {
    try {
      return this.loadFOLD(path, JSON.parse(str));
    } catch (error) {
      app.dialog.showError(error);
    }
  }

  loadUntitled(fold?: FOLD): void {
    return this.loadFOLD(
      {
        fullpath: "",
        directory: "",
        file: UNTITLED_FILENAME,
        root: "untitled",
        extension: `.${EXTENSION}`,
      },
      fold ? fold : emptyFOLD(),
    );
  }

  // this method is called if "File -> Save" was successful.
  // the actual fs.write operation happens outside of the app (in the backend),
  // so all we can do is get a confirmation if the save was successful or not.
  updateFileAsSaved(): void {
    this.file.modified = false;
  }

  // this method is called if "File -> SaveAs" was successful.
  // the actual fs.write operation happens outside of the app (in the backend),
  // so all we can do is get a confirmation if the save was successful or not.
  updateFileAsSavedAs(path: FilePathInfo): void {
    this.file.path = path;
    this.file.modified = false;
  }
}
