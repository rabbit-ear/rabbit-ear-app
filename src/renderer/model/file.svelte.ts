import type { FilePathInfo } from "../../main/fs/path.ts";
import app from "../app/App.svelte.ts";
import { EXTENSION, UNTITLED_FILENAME } from "../app/meta.svelte.ts";

//const emptyFilePathInfo = () => ({
//  fullpath: "",
//  directory: "",
//  file: "",
//  root: "",
//  extension: "",
//});

class File {
  // The currently opened filename as a full path, including the directory prefix.
  info: FilePathInfo | undefined = $state();
  // Has the current file been edited and not yet saved?
  modified: boolean = $state(false);
}

//export default new File();
const file = new File();
export default file;

export const setNewEmptyFile = (): void => {
  app.model.clear();
  file.info = {
    fullpath: "",
    directory: "",
    file: UNTITLED_FILENAME,
    root: "untitled",
    extension: `.${EXTENSION}`,
  };
  file.modified = false;
};

//export const setFile = (newFile: string) => {};
